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

    console.log('playerName', playerName);

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

  $('.create').click(function() {
    /*
    // TODO: create modal for input values
    // TODO: get parameter names for selected game type,
    // from game list received on page load (http://localhost:3000/api/games)

    let username = prompt('Username:');
    let size;
    let winLength;
    let success = false;
    while (!success) {
      size = prompt('Size:');
      success = !isNaN(size);
    }
    size = parseInt(size);
    success = false;
    while (!success) {
      winLength = prompt('Win Length:');
      success = !isNaN(winLength);
    }
    winLength = parseInt(winLength);
    gameSocket.emit('createRoom', username, 'amoba', { size, winLength });
    */
    let username = document.getElementById('username').value;
    gameSocket.emit('createRoom', username, 'amoba');
    playerName = username;

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

      gameSocket.emit('joinRoom', username, room);
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
  let canvasInfo = true;
  let winLength;
  let buttons = [];

  function playerTurnCanvasInfo() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    if (canvasInfo) {
      ctx.fillText("player's turn", 220, 170);
      canvasInfo = false;
    }
    if (enemyTurn) ctx.fillStyle = BLUE;
    else ctx.fillStyle = RED;
    ctx.fillRect(254, 70, 50, 50);
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
      loadGame();
    }
  }

  function createMap() {
    for (let i = 0; i < width * height; i++) {
      let j = i + 1;
      buttons[i] = document.createElement('button');
      buttons[i].id = NEUTRAL;
      document.getElementById('body').appendChild(buttons[i]);
      startStyleButtons(buttons[i]);
      breakLine(j);
    }
  }

  gameSocket.on('playerStep', function(username, idx) {
    if (playerName === username) return;
    nextRound(buttons[idx]);
    checkWinner();
    playerTurnCanvasInfo();
  });

  function clickOnButton() {
    buttons.forEach(function(button, i) {
      button.addEventListener('click', function() {
        if (enemyTurn) return;
        if (nextRound(button)) {
          gameSocket.emit('playerStep', i);
          checkWinner();
          playerTurnCanvasInfo();
        }
      });
    });
  }

  function breakLine(elementsInRow) {
    if (elementsInRow % width === 0) {
      const newLine = document.createElement('br');
      document.getElementById('body').appendChild(newLine);
    }
  }

  // change button's color when clicking on a button (2 colors)
  function nextRound(button) {
    if (button.style.background.split(' ')[0] !== BLUE && button.style.background.split(' ')[0] !== RED) {
      if (enemyTurn) {
        button.style.background = BLUE;
        button.id = BLUE;
      } else {
        button.style.background = RED;
        button.id = RED;
      }
      enemyTurn = !enemyTurn;
      return true;
    } else alert('This element has already been chosen!');
    return false;
  }

  // check if the board has a winning state or not -> this function is called when a button is clicked
  function checkWinner() {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].id !== NEUTRAL) {
        if (horizontalWin(i)) break;
        if (verticalWin(i)) break;
        if (rightCrossWin(i)) break;
        if (leftCrossWin(i)) break;
      }
    }
  }

  //end game function if the winning buttons are next to each other
  function endGame(redCounter, blueCounter, i, direction) {
    if (redCounter === winLength || blueCounter === winLength) {
      if (direction === 0) horizontalWinColor(i);
      else if (direction === 1) verticalWinColor(i);
      else if (direction === 2) rightCrossWinColor(i);
      else if (direction === 3) leftCrossWinColor(i);
      alert(buttons[i].id + ' is the winner!');
      setTimeout(function() {
        newGame();
      }, 2000);
      return true;
    }
    return false;
  }

  function horizontalValid(i) {
    let sameRow = 0;
    for (let m = i; m < i + winLength; m++) {
      if (Math.floor(m / width) === Math.floor(i / width)) sameRow++;
    }
    return sameRow === winLength;
  }

  //check if there are winLength number of buttons with the same color are next to each other
  function horizontalWin(i) {
    if (horizontalValid(i)) {
      let redCounter = 0;
      let blueCounter = 0;
      for (let k = i; k < i + winLength; k++) {
        if (buttons[k].id === RED) redCounter++;
        else if (buttons[k].id === BLUE) blueCounter++;
      }
      return endGame(redCounter, blueCounter, i, 0);
    }
    return false;
  }

  //check if there are winLength number of buttons with the same color are under each other
  function verticalWin(i) {
    if (i + (winLength - 1) * width < buttons.length) {
      let redCounter = 0;
      let blueCounter = 0;
      for (let m = i; m < i + winLength * width; m += width) {
        if (buttons[m].id === RED) redCounter++;
        else if (buttons[m].id === BLUE) blueCounter++;
      }
      return endGame(redCounter, blueCounter, i, 1);
    }
    return false;
  }

  //check if there are winLength number of buttons with the same color are under each other "in a cross" to the right
  function rightCrossWin(i) {
    if (i + (winLength - 1) * (width + 1) < buttons.length) {
      let redCounter = 0;
      let blueCounter = 0;
      for (let m = i; m < i + winLength * (width + 1); m += width + 1) {
        if (buttons[m].id === RED) redCounter++;
        else if (buttons[m].id === BLUE) blueCounter++;
      }
      return endGame(redCounter, blueCounter, i, 2);
    }
    return false;
  }

  function leftCrossWin(i) {
    if (i + (winLength - 1) * width < buttons.length) {
      let redCounter = 0;
      let blueCounter = 0;
      for (let m = i; m < i + winLength * (width - 1); m += width - 1) {
        if (buttons[m].id === RED) redCounter++;
        else if (buttons[m].id === BLUE) blueCounter++;
      }
      return endGame(redCounter, blueCounter, i, 3);
    }
    return false;
  }

  // new game starts in 2secs after winning, setting every button's value to default
  function newGame() {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].id = NEUTRAL;
      startStyleButtons(buttons[i]);
    }

    setTimeout(function() {
      for (let i = 0; i < width * height; i++) {
        document.getElementById('body').removeChild(buttons[i]);
      }
      $('.connect-wrapper').show();
      $('.list-wrapper').hide();
      $('.game-wrapper').hide();
      $('.az-igazi-game-wrapper').hide();
    }, 2000);
  }

  function horizontalWinColor(i) {
    for (let j = i; j < i + winLength; j++) {
      buttons[j].style.background = WINNER;
    }
  }

  function verticalWinColor(i) {
    for (let j = i; j < i + winLength * width; j += width) {
      buttons[j].style.background = WINNER;
    }
  }

  function rightCrossWinColor(i) {
    for (let j = i; j < i + winLength * (width + 1); j += width + 1) {
      buttons[j].style.background = WINNER;
    }
  }

  function leftCrossWinColor(i) {
    for (let j = i; j < i + winLength * (width - 1); j += width - 1) {
      buttons[j].style.background = WINNER;
    }
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

  function loadGame() {
    createMap();
    clickOnButton();
  }
});
