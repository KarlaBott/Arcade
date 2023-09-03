window.addEventListener("DOMContentLoaded", () => {
  const cells = Array.from(document.querySelectorAll(".cell"));
  const playerInfo = document.querySelector(".active-player");
  const btnReset = document.querySelector("#btnReset");
  const bannerText = document.querySelector(".banner");

  // add event listener for each cell in the grid
  cells.forEach((cell, idx) => {
    cell.addEventListener("click", () => userAction(cell, idx));
  });

  btnReset.addEventListener("click", function (event) {
    location.reload();
    initializeGame();
  });

  let gameObj = new Object();
  gameObj = {
    gameBoard: new Array(),
    isGameActive: true,
    currentTurn: "X",
  };

  // Board indexes:  Row1 = 0, 1, 2; Row2 = 3, 4, 5; Row3 = 6, 7, 8
  let winningArrays = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // return the player name from sessionStorage variables
  function showName(inChar) {
    return inChar == "X"
      ? window.sessionStorage.getItem("glbName1")
      : window.sessionStorage.getItem("glbName2");
  }

  // initialize the game board: 1D array of 9 single blank spaces
  function initializeGame() {
    for (let i = 0; i < 9; i++) {
      gameObj.gameBoard[i] = " ";
    }
    gameObj.isGameActive = true;
    gameObj.currentTurn = "X";
    bannerText.innerText =
      "Ready to play Tic-Tac-Toe! Click in any square to begin play.";
    playerInfo.innerText =
      "Current player is: " + showName(gameObj.currentTurn);
  }

  //-----------------
  // userAction - user hit a clickable space on the board
  // INPUT:   cell - object, the grid space the user hit
  //          idx - integer, the index of the space they clicked on
  // OUTPUT:  none - updates global gameObj.gameBoard and board-grid display
  //-----------------
  function userAction(cell, idx) {
    // if this cell is not already occupied and the game is still active
    if (
      cell.innerText != "X" &&
      cell.innerText != "O" &&
      gameObj.isGameActive
    ) {
      bannerText.innerText = "-";
      // fille gameBoard at selected index with currentTurn (either 'X' or 'O')
      gameObj.gameBoard[idx] = gameObj.currentTurn;
      // fill the grid display, the cell with same (either X or O)
      cell.innerText = gameObj.gameBoard[idx];
      // call validateResult to see if game is over
      validateResult();
      // if the game isn't over, then change whose turn it is
      if (gameObj.isGameActive) {
        gameObj.currentTurn = gameObj.currentTurn == "X" ? "O" : "X";
        playerInfo.innerText =
          "Current player is: " + showName(gameObj.currentTurn);
      } // endIf isGameActive
    } else {
      // else - the selected cell is occupied or unselectable
      if (gameObj.isGameActive) {
        bannerText.innerText =
          "Selected box is already occupied.  Choose another.";
      } else {
        bannerText.innerText = 'Click on "RESET Game" to play again.';
      }
    }
  }

  function highlightWinnerCells(inAry) {
    for (let x = 0; x < inAry.length; x++) {
      cells[inAry[x]].classList.add("winner-color");
    }
  }

  //-----------------
  // validateResult - determine if there is a winner, or tie game
  // INPUT:   none - uses gameObj.gameBoardn
  // OUTPUT:  none - updates global gameObj.gameBoard
  //-----------------
  function validateResult() {
    for (let i = 0; i < winningArrays.length; i++) {
      let wonThis = winningArrays[i];
      let char1 = gameObj.gameBoard[wonThis[0]];
      let char2 = gameObj.gameBoard[wonThis[1]];
      let char3 = gameObj.gameBoard[wonThis[2]];
      if (char1 == " " || char2 == " " || char3 == " ") {
        continue;
      }
      if (char1 == char2 && char2 == char3) {
        gameObj.isGameActive = false;
        bannerText.innerText =
          showName(gameObj.currentTurn) + " WON this game!";
        highlightWinnerCells(winningArrays[i]);
        return;
      }
      // if all squares are occupied, then it is a tie game
      if (!gameObj.gameBoard.includes(" ")) {
        gameObj.isGameActive = false;
        bannerText.innerText = "CAT GAME!";
      }
    }
  } // endFcn validateResult

  initializeGame();
});
