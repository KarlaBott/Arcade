window.addEventListener("DOMContentLoaded", () => {
  const playerInfo = document.querySelector(".active-player");
  const btnReset = document.querySelector("#btnReset");
  const bannerText = document.querySelector(".banner");
  const selectColor1 = document.getElementById("select1");
  const selectColor2 = document.getElementById("select2");
  const circle1 = document.getElementById("color1");
  const circle2 = document.getElementById("color2");

  let gameObj = new Object();
  gameObj = {
    gameBoard: new Array(new Array()),
    lastFilledRow: new Array(), // for each column, note what the last filled row is
    isGameActive: true,
    byWin: true, // game is over (grid full), but no one won
    currentTurn: "1",
    color1: "red",
    colorOpt1: 0,
    color2: "yellow",
    colorOpt2: 1,
    iMaxRow: 6,
    iMaxCol: 7,
    iNumToWin: 4, // how many tokens in a row does it take to win
    iCntRed: 0, // don't bother checking for a win until at least 4 of color are on the board
    iCntYel: 0, // don't bother checking for a win until at least 4 of color are on the board
  };

  btnReset.addEventListener("click", function (event) {
    location.reload();
    createBoard();
  });

  // return the player name from sessionStorage variables  (currentTurn is either '1' or '2')
  function showName() {
    return (
      "Player " +
      gameObj.currentTurn +
      " - " +
      window.sessionStorage.getItem("glbName" + gameObj.currentTurn)
    );
  }

  //-----------------
  // changeColor - change the color any currently colored cell-circles  to match the new color selection
  //    This function will change all of Player1 or Player2's circles.  When a player makes a new color selection, also disable that
  //    same color selection on the other player's available color list, so they can never both choose the same color.
  // INPUT:   thisNameId - string, id of the color selection object that this player was selecting from, either 'select1' or 'select2'
  // OUTPUT:  none - updates the boardGrid
  //-----------------
  function changeColor(thisNameId) {
    let thisNameObj = thisNameId == "select1" ? selectColor1 : selectColor2; // get the selected player's obj ref - player who just chose a color
    let theOtherObj = thisNameId == "select1" ? selectColor2 : selectColor1; // get the other player's object ref
    let chosenColor = thisNameObj.value;
    let prevColor = gameObj["color" + thisNameId.at(-1)];
    gameObj["color" + thisNameId.at(-1)] = chosenColor;

    // change ALL currently colored cells to the new selected color - player can change color at any time during the game
    for (let i = 0; i < gameObj.iMaxRow; i++) {
      for (let j = 0; j < gameObj.iMaxCol; j++) {
        let idThisPos = "r" + i + "c" + j;
        let oneCell = document.getElementById(idThisPos);
        if (oneCell.classList.contains(prevColor)) {
          oneCell.classList.remove(prevColor);
          oneCell.classList.add(chosenColor);
        }
      }
    }

    let opt1 = thisNameObj.selectedIndex;
    // first, re-enable all colors for other player
    for (let x = 0; x < theOtherObj.options.length; x++) {
      theOtherObj.options["" + x].disabled = false;
    }
    // and then, disable the chosenColor that currently selecting player just chose - so other play cannot make this same selection
    theOtherObj.options[opt1].disabled = true;

    // remove previous color and add new one to the player's single circle showing their selection (circle to the left of Player color selctions)
    if (thisNameId.at(-1) == "1") {
      circle1.classList.remove(prevColor);
      circle1.classList.add(chosenColor);
    } else {
      circle2.classList.remove(prevColor);
      circle2.classList.add(chosenColor);
    }
  } // endFcn changeColor

  selectColor1.addEventListener("change", function (event) {
    changeColor(event.target.id);
  });

  selectColor2.addEventListener("change", function (event) {
    changeColor(event.target.id);
  });

  //-----------------
  // removeRefreshOldStuff - initialize the the player color selction lists and displays, remove the old board-grid
  // INPUT/OUTPUT:   none - updates the global gameObj and window display
  //-----------------
  function removeRefreshOldStuff() {
    if (selectColor1.hasChildNodes()) {
      while (selectColor1.hasChildNodes()) {
        selectColor1.removeChild(selectColor1.firstChild);
      }
    }

    if (selectColor2.hasChildNodes()) {
      while (selectColor2.hasChildNodes()) {
        selectColor2.removeChild(selectColor2.firstChild);
      }
    }

    let colorList = ["red", "yellow", "chartreuse", "gray"];
    let colorName = ["Red", "Yellow", "Bright Green", "Gray"];
    let optCell = new Object();
    for (let k = 0; k < colorList.length; k++) {
      optCell = document.createElement("option");
      optCell.value = colorList[k];
      optCell.innerText = colorName[k];
      selectColor1.add(optCell);
    }
    for (let k = 0; k < colorList.length; k++) {
      optCell = document.createElement("option");
      optCell.value = colorList[k];
      optCell.innerText = colorName[k];
      selectColor2.add(optCell);
    }
    gameObj.color1 = "red";
    gameObj.color2 = "yellow";
    selectColor1.selectedIndex = 0;
    selectColor2.selectedIndex = 1;
    selectColor1.options[1].disabled = true;
    selectColor2.options[0].disabled = true;
    circle1.classList.add(gameObj.color1);
    circle2.classList.add(gameObj.color2);

    let boardGrid = document.getElementById("board-grid");
    // clear any previous boardGrid nodes
    if (boardGrid.hasChildNodes()) {
      while (boardGrid.hasChildNodes()) {
        boardGrid.removeChild(boardGrid.firstChild);
      }
    }
  }

  //-----------------
  // createBoard - initialize a new game
  // INPUT/OUTPUT:   none - updates the global gameObj and window display
  //-----------------
  function createBoard() {
    playerInfo.innerText = "Current player is " + showName();
    bannerText.innerText = "Ready to play Connect Four!";

    removeRefreshOldStuff();

    // lastFilledRow array is a 1D array of what the lastFilledRow was for each column
    gameObj.lastFilledRow = new Array();
    for (let j = 0; j < gameObj.iMaxCol; j++) {
      gameObj.lastFilledRow.push(gameObj.iMaxRow);
    }

    let boardGrid = document.getElementById("board-grid");
    // create gameBoard: a 2D array of iMaxRows and iMaxCols
    let oneRow = new Array();
    for (let i = 0; i < gameObj.iMaxRow; i++) {
      for (let j = 0; j < gameObj.iMaxCol; j++) {
        if (j == 0) {
          oneRow = new Array();
        }
        oneRow.push("");
        // create div elements for the grid display, each with an id of rNcN, where N is the row and column number
        // <div> id="rNcN" class="cell cell-circle">rNcN</div>
        let divCell = document.createElement("div");
        let idThisPos = "r" + i + "c" + j;
        divCell.classList.add("cell");
        divCell.classList.add("cell-circle");
        divCell.setAttribute("id", idThisPos);
    //    divCell.innerText = idThisPos;
        boardGrid.appendChild(divCell);
        if (i == 0) {
          // only the top row, row 0, of cells need an event listener
          let cell = document.getElementById(idThisPos);
          cell.addEventListener("click", (ev) => userAction(ev));
          cell.classList.add("top-row");
        }
      }
      gameObj.gameBoard.push(oneRow);
    }
  }

  //-----------------
  // userAction - what to do when a player clicks
  // INPUT:   ev - object, event handle
  // OUTPUT:   none - updates the global gameObj and window display
  //-----------------
  function userAction(ev) {
    if (!gameObj.isGameActive) {
      if (gameObj.byWin) {
        bannerText.innerText = "GAME OVER.";
        bannerText.innerText += " " + showName() + " WON. ";
      } else {
        bannerText.innerText = "GAME OVER. Board is full. No winner. ";
      }
      bannerText.innerText += " " + ' Click on "RESET Game" to play again.';
      return;
    }
    bannerText.innerText = "-";
    // get the id of the cell user clicked in, as the id is a string that has row/col location (i.e. 'r40c3') - only row 0 is clickable
    let curCellRef = ev.target.id;
    // parse the id string to get the drop column user selected
    let iDropCol = parseInt(curCellRef.charAt(3), 10);
    // if the selected column is not full ...
    if (gameObj.lastFilledRow[iDropCol] > 0) {
      // change the lastFilledRow for this column to one less (started at 6, so initial token is placed in grid row 5)
      gameObj.lastFilledRow[iDropCol] = gameObj.lastFilledRow[iDropCol] - 1;
      // create an id reference for the cell that just got filled
      var idForCell = "r" + gameObj.lastFilledRow[iDropCol] + "c" + iDropCol;
      let updateCell = document.getElementById(idForCell);
      // update the grid cell contents
    //  updateCell.innerText = gameObj.currentTurn;
      // update the corresponding gameBoard array entry
      gameObj.gameBoard[gameObj.lastFilledRow[iDropCol]][iDropCol] =
        gameObj.currentTurn;
      // update the cell color on the board-grid
      updateCell.classList.add(gameObj["color" + gameObj.currentTurn]);
      // increment the token count played for this color
      gameObj.currentTurn == "1" ? gameObj.iCntRed++ : gameObj.iCntYel++;
    } else {
      // selected column is full, so check to see if any other column is still available
      if (!isBoardFull()) {
        bannerText.innerText = "Selected column is full.  Choose another.";
      }
      return;
    } // endIf selected column

    validateResult(idForCell); // go check for a winner

    if (gameObj.isGameActive) {
      // switch players
      gameObj.currentTurn = gameObj.currentTurn == "1" ? "2" : "1";
      playerInfo.innerText = "Current player is " + showName();
    }
    isBoardFull(); // check to see ifthe grid is full
  }

  //-----------------
  // isBoardFull - check to see if the grid is completely filled or not
  // INPUT:   none - updates the global gameObj and window display
  // OUTPUT:   boolean - true if the board is full, otherwise false
  //-----------------
  function isBoardFull() {
    for (let b = 0; b < gameObj.iMaxCol; b++) {
      if (gameObj.lastFilledRow[b] != 0) {
        return false;
      }
    }
    gameObj.byWin = false;
    gameObj.isGameActive = false;
    bannerText.innerText = "GAME OVER! Board is full. No winner.";
    return true;
  }

  //-----------------
  // validateResult - determine if there is a winner, or gameboard is full - display applicable message in bannerText if game is over
  // INPUT/OUTPUT:   none - updates the global gameObj and window display
  //-----------------
  function validateResult(pIdCell) {
    if (gameObj.currentTurn == "1" && gameObj.iCntRed < gameObj.iNumToWin)
      return;
    if (gameObj.currentTurn == "2" && gameObj.iCntYel < gameObj.iNumToWin)
      return;
    let iRow = parseInt(pIdCell.charAt(1), 10);
    let iCol = parseInt(pIdCell.charAt(3), 10);
    checkHorizontal(iRow);
    if (gameObj.isGameActive) {
      checkVertical(iCol);
    }
    if (gameObj.isGameActive) {
      checkDiagRight();
    }
    if (gameObj.isGameActive) {
      checkDiagLeft();
    }
    return;
  }

  //-----------------
  // checkHorizontal - check for 4 tokens next to each other in any row
  // INPUT:   pRow - row number where the most recent token was dropped
  // OUTPUT:   none - sets global isGameActive to false if 4 found and display who won
  //-----------------
  function checkHorizontal(pRow) {
    let iCntTokens = 0;
    for (let i = 0; i < gameObj.iMaxCol; i++) {
      if (gameObj.gameBoard[pRow][i] == gameObj.currentTurn) {
        iCntTokens++;
        if (iCntTokens == gameObj.iNumToWin) {
          gameObj.isGameActive = false;
          bannerText.innerText = showName() + " WON this game!";
          return;
        }
      } else {
        iCntTokens = 0;
      }
    }
  }

  //-----------------
  // checkHorizontal - check for 4 tokens next to each other in any column
  // INPUT:   pCol - pCol number where the most recent token was dropped
  // OUTPUT:   none - sets global isGameActive to false if 4 found and display who won
  //-----------------
  function checkVertical(pCol) {
    let iCntTokens = 0;
    for (let i = 0; i < gameObj.iMaxRow; i++) {
      if (gameObj.gameBoard[i][pCol] == gameObj.currentTurn) {
        iCntTokens++;
        if (iCntTokens == gameObj.iNumToWin) {
          gameObj.isGameActive = false;
          bannerText.innerText = showName() + " WON this game!";
          return;
        }
      } else {
        iCntTokens = 0;
      }
    }
  }

  //-----------------
  // checkDiagRight - check for 4 tokens next to each other on diagonal leaning right
  // INPUT:    none - check a fixed set of starting points
  // OUTPUT:   none - sets global isGameActive to false if 4 found and display who won
  //-----------------
  function checkDiagRight() {
    let iCntTokens = 0;
    let i = 0;
    let j = 0;
    let startingPointArray = [
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [1, 6],
      [2, 6],
    ];
    for (let k = 0; k < startingPointArray.length; k++) {
      i = startingPointArray[k][0];
      j = startingPointArray[k][1];
      iCntTokens = 0;
      //console.log('i='+ i +' j='+ j);
      while (i > -1 && j > -1 && i < gameObj.iMaxRow && j < gameObj.iMaxCol) {
        if (gameObj.gameBoard[i][j] == gameObj.currentTurn) {
          iCntTokens++;
          if (iCntTokens == gameObj.iNumToWin) {
            gameObj.isGameActive = false;
            bannerText.innerText = showName() + " WON this game!";
            return;
          }
        } else {
          iCntTokens = 0;
        }
        i++;
        j--;
      }
    }
  }

  //-----------------
  // checkDiagLeft - check for 4 tokens next to each other on diagonal leaning left
  // INPUT:    none - check a fixed set of starting points
  // OUTPUT:   none - sets global isGameActive to false if 4 found and display who won
  //-----------------
  function checkDiagLeft() {
    let iCntTokens = 0;
    let i = 0;
    let j = 0;
    let startingPointArray = [
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    for (let k = 0; k < startingPointArray.length; k++) {
      i = startingPointArray[k][0];
      j = startingPointArray[k][1];
      iCntTokens = 0;
      //console.log('i='+ i +' j='+ j);
      while (i > -1 && j > -1 && i < gameObj.iMaxRow && j < gameObj.iMaxCol) {
        if (gameObj.gameBoard[i][j] == gameObj.currentTurn) {
          iCntTokens++;
          if (iCntTokens == gameObj.iNumToWin) {
            gameObj.isGameActive = false;
            bannerText.innerText = showName() + " WON this game!";
            return;
          }
        } else {
          iCntTokens = 0;
        }
        i++;
        j++;
      }
    }
  }

  createBoard();
}); // endFcn  DOMContentLoaded
