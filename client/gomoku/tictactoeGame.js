
let c = document.getElementById("ex");
let ctx = c.getContext("2d");
let selectMapSize = document.getElementById("mapSize");
let selectWinLength = document.getElementById("lengthOfWin");
let startButtonID = document.getElementById("startButton");

const NEUTRAL = "neutral";
const RED = "red";
const BLUE = "blue";
const WINNER = "#FFBF00";

let wantToStart;
let height;
let width;
let canvasInfo = true;
let winLength;
let buttons = [];
let enemyTurn;
let playerOneName, playerOneColor;
let playerTwoName, playerTwoColor;


function enterPlayerOneData () {
    playerOneName = prompt ("Please enter your name (1st player): ", "Player 1");
    if (playerOneName === null || playerOneName === "") playerOneName = "Player 1";

    playerOneColor = prompt ("Please choose a color! Type 'RED' or 'BLUE' into the input box!", "RED");
    playerOneColor = playerOneColor.toUpperCase();
    if (!(playerOneColor === "red".toUpperCase() || playerOneColor === "blue".toUpperCase())) playerOneColor = "RED";

    wantToStart = prompt ("Would you like to start the game? Type 'YES' or 'NO' into the input box!", "YES");
    wantToStart = wantToStart.toUpperCase();

    if (playerOneColor === "red".toUpperCase()) {
        if (!(wantToStart === "yes".toUpperCase() || wantToStart === "no".toUpperCase())) enemyTurn = false;
        else if (wantToStart === "yes".toUpperCase()) enemyTurn = false;
        else if (wantToStart === "no".toUpperCase()) enemyTurn = true;
    } else {
        if (!(wantToStart === "yes".toUpperCase() || wantToStart === "no".toUpperCase())) enemyTurn = true;
        else if (wantToStart === "yes".toUpperCase()) enemyTurn = true;
        else if (wantToStart === "no".toUpperCase()) enemyTurn = false;
    }

}


function enterPlayerTwoData () {
    playerTwoName = prompt ("Please enter your name (2nd player): ", "Player 2");
    if (playerTwoName === playerOneName || playerTwoName === null || playerTwoName === "") playerTwoName = "Player 2";
    if (playerOneColor === "red".toUpperCase()) playerTwoColor = "BLUE";
    else playerTwoColor = "RED";
    playerTwoColor = playerTwoColor.toUpperCase();
}


function playerTurnCanvasInfo() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    if (canvasInfo) {
        ctx.fillText("player's turn", 230, 160);
        canvasInfo = false;
    }
    if (enemyTurn) ctx.fillStyle = BLUE;
    else ctx.fillStyle = RED;
    ctx.fillRect(254, 70, 50, 50);
}


function createCanvasInfo() {
    ctx.fillStyle = "#235523";
    ctx.rect(0, 0, 567, 200);
    ctx.stroke();

    ctx.fillStyle = RED;
    ctx.fillRect(80, 70, 50, 50);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";

    let playerOneRed = playerOneColor === "red".toUpperCase();
    let playerTwoBlue = playerTwoColor === "blue".toUpperCase();

    if (playerOneRed) ctx.fillText(playerOneName, 60, 50);
    else ctx.fillText(playerTwoName, 60, 50);

    ctx.fillStyle = BLUE;
    ctx.fillRect(440, 70, 50, 50);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";

    if (playerTwoBlue) ctx.fillText(playerTwoName, 420, 50);
    else ctx.fillText(playerOneName, 420, 50);

    playerTurnCanvasInfo();
}


function startGame() {
    height = selectMapSize.options[selectMapSize.selectedIndex].value;
    height = parseInt(height, 10);
    width = height;
    winLength = selectWinLength.options[selectWinLength.selectedIndex].value;
    winLength = parseInt(winLength, 10);

    if (height !== 0 && winLength !== 0) {
        selectMapSize.disabled = true;
        selectWinLength.disabled = true;
        startButtonID.disabled = true;
        enterPlayerOneData();
        enterPlayerTwoData();
        createCanvasInfo();
        loadGame();
    }
}


function createMap () {
    for (let i = 0; i < width * height; i++) {
        let j = i + 1;
        buttons[i] = document.createElement("button");
        buttons[i].id = NEUTRAL;
        document.body.appendChild(buttons[i]);
        startStyleButtons(buttons[i]);
        breakLine(j);
    }
}


function clickOnButton () {
    buttons.forEach (function (button) {
        button.addEventListener("click", function () {
            nextRound(button);
            checkWinner();
            playerTurnCanvasInfo();
        });
    });
}


function breakLine (elementsInRow) {
    if (elementsInRow % width === 0) {
        const newLine = document.createElement('br');
        document.body.appendChild(newLine);
    }
}


// change button's color when clicking on a button (2 colors)
function nextRound (button) {
    if (button.style.background !== BLUE && button.style.background !== RED) {
        if (enemyTurn) {
            button.style.background = BLUE;
            button.id = BLUE;
        }
        else {
            button.style.background = RED;
            button.id = RED;
        }
        enemyTurn = !enemyTurn
    } else alert("This element has already been chosen!")
}


// check if the board has a winning state or not -> this function is called when a button is clicked
function checkWinner () {
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
function endGame (redCounter, blueCounter, i, direction) {
    if (redCounter === winLength || blueCounter === winLength) {
        if (direction === 0) horizontalWinColor(i);
        else if (direction === 1) verticalWinColor(i);
        else if (direction === 2) rightCrossWinColor(i);
        else if (direction === 3) leftCrossWinColor(i);
        alert (buttons[i].id + " is the winner!");
        setTimeout (function() { newGame(); }, 2000);
        return true;
    }
    return false;
}


function horizontalValid (i) {
    let sameRow = 0;
    for (let m = i; m < i + winLength; m++) {
        if (Math.floor(m / width) === Math.floor(i / width)) sameRow++;
    }
    return sameRow === winLength;
}


//check if there are winLength number of buttons with the same color are next to each other
function horizontalWin (i) {
    if (horizontalValid(i)) {
        let redCounter = 0;
        let blueCounter = 0;
        for (let k = i; k < i + winLength; k++) {
            if (buttons[k].id === RED) redCounter++;
            else if (buttons[k].id === BLUE) blueCounter++;
        }
        return (endGame(redCounter, blueCounter, i, 0));
    }
    return false;
}


//check if there are winLength number of buttons with the same color are under each other
function verticalWin (i) {
    if ((i + ((winLength - 1) * width)) < buttons.length) {
        let redCounter = 0;
        let blueCounter = 0;
        for (let m = i; m < i + (winLength * width); m += width) {
            if (buttons[m].id === RED) redCounter++;
            else if (buttons[m].id === BLUE) blueCounter++;
        }
        return (endGame(redCounter, blueCounter, i, 1));
    }
    return false;
}


//check if there are winLength number of buttons with the same color are under each other "in a cross" to the right
function rightCrossWin (i) {
    if ((i + ((winLength - 1) * (width + 1))) < buttons.length) {
        let redCounter = 0;
        let blueCounter = 0;
        for (let m = i; m < i + (winLength * (width + 1)); m += (width + 1)) {
            if (buttons[m].id === RED) redCounter++;
            else if (buttons[m].id === BLUE) blueCounter++;
        }
        return endGame(redCounter, blueCounter, i, 2);
    }
    return false;
}


function leftCrossWin (i) {
    if ((i + ((winLength - 1) * width)) < buttons.length) {
        let redCounter = 0;
        let blueCounter = 0;
        for (let m = i; m < i + (winLength * (width - 1)); m += (width - 1)) {
            if (buttons[m].id === RED) redCounter++;
            else if (buttons[m].id === BLUE) blueCounter++;
        }
        return endGame(redCounter, blueCounter, i, 3);
    }
    return false;
}


// new game starts in 2secs after winning, setting every button's value to default
function newGame () {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].id = NEUTRAL;
        startStyleButtons(buttons[i]);
    }
}


function horizontalWinColor (i) {
    for (let j = i; j < i + winLength; j++) {
        buttons[j].style.background = WINNER;
    }
}


function verticalWinColor (i) {
    for (let j = i; j < i + (winLength * width); j += width) {
        buttons[j].style.background = WINNER;
    }
}


function rightCrossWinColor (i) {
    for (let j = i; j < i + (winLength * (width + 1)); j += (width + 1)) {
        buttons[j].style.background = WINNER;
    }
}


function leftCrossWinColor (i) {
    for (let j = i; j < i + (winLength * (width - 1)); j += (width - 1)) {
        buttons[j].style.background = WINNER;
    }
}


function startStyleButtons(button) {
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.background = "#345121";
    button.style.fontSize = '15px';
    button.style.border = '1px solid white';
    button.style.margin = '0px';
    button.style.transition = '0.3s';
    button.style.borderRadius = '6px';
    button.style.marginTop = "-3px";
    button.style.cursor = "pointer";
}


function loadGame() {
    createMap();
    clickOnButton();
}