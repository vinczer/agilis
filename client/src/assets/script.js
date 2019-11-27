function showModal(title, text, onClose) {
  $('#infoTitle').text(title);
  $('#infoText').text(text);
  $('#infoCloseX').click(onClose);
  $('#infoCloseOk').click(onClose);
  $('#infoModal').modal('toggle');
}

$(document).ready(function() {
  let gameSocket = io('http://localhost:3000/game');
  let playerName;
  let enemyTurn;

  gameSocket.on('connect', function() {
    console.log('Connected WS.');
  });

  gameSocket.on('joinRoomFailed', function(username) {
    alert('join failed with username ' + username);
  });

  gameSocket.on('joinRoomSuccess', function(username, room) {
    playerName = username;

    $('.list-wrapper').hide();
    $('.game-wrapper').show();
  });

  gameSocket.on('gameStarted', function(playerTurn, parameters) {
    enemyTurn = playerTurn !== playerName;

    $('.connect-wrapper').hide();
    $('.list-wrapper').hide();
    $('.game-wrapper').hide();
    $('.az-igazi-game-wrapper').show();

    startGame(parameters);
  });

  gameSocket.on('updateRoomList', function(rooms) {
    let tmp = '';
    for (let room in rooms) {
      tmp +=
        '<button type="button" class="join btn btn-secondary" data-room="' +
        rooms[room].name +
        '">' +
        rooms[room].creator +
        ' szobája' +
        '</button><br><br>';
    }

    $('.list-wrapper .items').html(tmp);
  });

  gameSocket.on('playerStep', function(username, i, j) {
    if (playerName === username) return;
    nextRound(buttons[i][j]);
    checkWinner();
    playerTurnCanvasInfo();
  });

  gameSocket.on('enemyLeft', function() {
    if (gameIsRunning)
      showModal('Kilépő ellenfél', 'Az ellenfeled kilépett, vége a játéknak!', () => location.reload());
  });

  function validateIntField(min, max, fieldId) {
    let fieldValue = document.getElementById(fieldId).value;
    if (!fieldValue || isNaN(fieldValue)) return false;

    let validValue = Math.min(max, Math.max(parseInt(fieldValue), min));
    document.getElementById(fieldId).value = validValue;

    if (+fieldValue !== +validValue) return false;
    return validValue;
  }

  $('.create').click(function() {
    let username = document.getElementById('username').value;
    if (!username) return alert('Felhasználónév megadása kötelező!');

    let size = validateIntField(3, 16, 'size');
    if (!size) return alert('A méret 3 és 16 közti egész szám kell legyen!');

    let winLength = validateIntField(3, 16, 'winLength');
    if (!winLength) return alert('A győzelmi hossz 3 és 16 közti egész szám kell legyen!');

    size = Math.min(10, Math.max(parseInt(size), 3));
    winLength = Math.min(10, Math.max(parseInt(winLength), 3));

    gameSocket.emit('createRoom', username, 'amoba', { size, winLength });

    playerName = username;

    $('#createModal').modal('toggle');
    $('.connect-wrapper').hide();
    $('.game-wrapper').show();
  });

  $('.list').click(function() {
    $('.connect-wrapper').hide();
    $('.list-wrapper').show();
    gameSocket.emit('listLobbies', 'amoba');
  });

  $('.list-wrapper').on('click', '.join', function() {
    let room = $(this).data('room');
    $('.csatlakozas').click(function() {
      let username = document.getElementById('joinname').value;
      if (!username) return alert('Felhasználónév megadása kötelező!');

      gameSocket.emit('joinRoom', username, room);

      $('#connectModal').modal('toggle');
    });
  });

  let c = document.getElementById('ex');
  let ctx = c.getContext('2d');

  const NEUTRAL = 'neutral';
  const RED = 'red';
  const BLUE = 'blue';
  const WINNER = '#FFBF00';

  let height;
  let width;
  let winLength;
  let buttons = [];
  let gameIsRunning = true;

  function playerTurnCanvasInfo() {
    let prevTurnInfo = (!enemyTurn ? "Enemy Player's" : 'Your') + ' turn';
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    // have to call it three times to completely remove previous text
    ctx.fillText(prevTurnInfo, 278, 170);
    ctx.fillText(prevTurnInfo, 278, 170);
    ctx.fillText(prevTurnInfo, 278, 170);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    if (!gameIsRunning) {
      ctx.fillText('You ' + (enemyTurn ? 'won!' : 'lost!'), 278, 170);
    } else {
      ctx.fillText((enemyTurn ? "Enemy Player's" : 'Your') + ' turn', 278, 170);

      let turnColor = enemyTurn ? BLUE : RED;
      ctx.fillStyle = turnColor;
      ctx.fillRect(254, 70, 50, 50);
    }
  }

  function createCanvasInfo() {
    ctx.fillStyle = '#235523';
    ctx.rect(0, 0, 567, 200);
    ctx.stroke();
    playerTurnCanvasInfo();
  }

  function startGame(parameters) {
    height = parameters.size;
    width = parameters.size;
    winLength = parameters.winLength;

    if (height !== 0 && winLength !== 0) {
      createCanvasInfo();
      createMap();
    }
  }

  function createMap() {
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        let button = document.createElement('button');
        button.id = NEUTRAL;
        document.getElementById('body').appendChild(button);
        startStyleButtons(button);
        button.addEventListener('click', () => {
          if (enemyTurn) return;
          if (nextRound(button)) {
            gameSocket.emit('playerStep', i, j);
            checkWinner();
            playerTurnCanvasInfo();
          }
        });
        row.push(button);
      }
      buttons.push(row);
      let newLine = document.createElement('br');
      document.getElementById('body').appendChild(newLine);
    }
  }

  // change button's color on click (2 colors)
  function nextRound(button) {
    if (button.id === BLUE || button.id === RED) {
      alert('This element has already been chosen!');
      return false;
    }

    button.style.background = enemyTurn ? BLUE : RED;
    button.id = enemyTurn ? BLUE : RED;
    enemyTurn = !enemyTurn;
    return true;
  }

  // check if the board has a winning state or not -> this function is called when a button is clicked
  function checkWinner() {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (buttons[i][j].id !== NEUTRAL) {
          if (
            (j + winLength <= width && checkWin(i, j, 0, 1)) ||
            (i + winLength <= height && checkWin(i, j, 1, 0)) ||
            (j + winLength <= width && i + winLength <= height && checkWin(i, j, 1, 1)) ||
            (j - winLength >= -1 && i + winLength <= height && checkWin(i, j, 1, -1))
          )
            return;
        }
      }
    }
  }

  //end game function
  function endGame(winStreak) {
    if (winStreak.length !== winLength || !gameIsRunning) return false;

    gameIsRunning = false;
    winStreak.forEach(elem => {
      elem.style.background = WINNER;
    });

    setTimeout(function() {
      clearGame();
    }, 1000);
    return true;
  }

  function checkWin(i, j, incI, incJ) {
    let color = buttons[i][j].id;
    let k = i + incI;
    let l = j + incJ;
    let moves = 1;
    let winStreak = [buttons[i][j]];
    while (moves < winLength && k >= 0 && k < height && l >= 0 && l < width) {
      if (buttons[k][l].id !== color) return false;
      winStreak.push(buttons[k][l]);
      moves++;
      k += incI;
      l += incJ;
    }
    return endGame(winStreak);
  }

  // clear game when it's ended
  function clearGame() {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        buttons[i][j].id = NEUTRAL;
        startStyleButtons(buttons[i][j]);
      }
    }

    setTimeout(function() {
      if (enemyTurn) showModal('Ügyes vagy!', 'Gratulálok, nyertél!', () => location.reload());
      else showModal('Vesztettél!', 'Ez most nem jött össze :(', () => location.reload());
    }, 275);
  }

  function startStyleButtons(button) {
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.background = '#345121';
    button.style.fontSize = '15px';
    button.style.border = '1px solid white';
    button.style.margin = '0px';
    button.style.transition = '0.3s';
    button.style.borderRadius = '6px';
    button.style.marginTop = '-3px';
    button.style.cursor = 'pointer';
  }
});
