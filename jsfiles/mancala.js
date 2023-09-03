window.addEventListener("DOMContentLoaded", () => {
  const playerInfo = document.querySelector(".active-player");
  const btnReset = document.querySelector("#btnReset");
  const bannerText = document.querySelector(".banner");

  btnReset.addEventListener("click", function (event) {
    location.reload();
    createBoard();
  });

  let gameObj = new Object();
  gameObj = {
    // 1D array of 14 integers, indexes are storing values in counter-clockwise, ascending order
    //    array positions: 0 = player1 store, 13 down to 8 = player 1 pits,
    //    array positions: 1 to 6 = player 2 pits, 7 = player 1 store
    gameBoard: new Array(), // array of 14 integers, 0
    isGameActive: true,
    // Player 1 - assigned top row displayed (store 0, pit indices 13 to 8)
    // Player 2 - assigned bottom row displayed (pit indices 1 to 6, store 7)
    currentTurn: "1",
  };

  // easy way to get the opposite pit space
  let objOppositePit = {
    1: 13,
    2: 12,
    3: 11,
    4: 10,
    5: 9,
    6: 8,
    8: 6,
    9: 5,
    10: 4,
    11: 3,
    12: 2,
    13: 1,
  };

  // return the player name from sessionStorage variables  (currentTurn is either '1' or '2')
  function showName() {
    return window.sessionStorage.getItem("glbName" + gameObj.currentTurn);
  }

  //-----------------
  // addStore - create HTML element for Player store, with id of 'pN' where N is a number corresponding to the gameBoard array
  // INPUT:    pNum - integer, index number of the store being created (either 0 or 7)
  //           pSide - string, either "left" or "right"
  // OUTPUT:   none, element created on board-grid
  //
  // create left or right pit - nested: outer <div> for background-color, and inner <div> to create oval shape for pit
  // <div class="left/right-store"> <div  class="left/right-pit" id="p?" </div> </div>
  //-----------------
  function addStore(pNum, pSide) {
    let boardGrid = document.getElementById("board-grid");
    let pitSection = document.createElement("div");
    pitSection.classList.add(pSide + "-store");
    let divCell = document.createElement("div");
    divCell.classList.add(pSide + "-pit");
    divCell.setAttribute("id", "p" + pNum);
    divCell.innerText = 0;
    pitSection.appendChild(divCell);
    boardGrid.appendChild(pitSection);
  }

  //-----------------
  // addPitItem - create HTML element for player pits, with id of 'pN' where N is a number corresponding to the gameBoard array
  // INPUT:    pNum - integer, index number of the store being created (either 0 or 7)
  // OUTPUT:   none, element created on board-grid
  //
  // create egg carton of player pits
  // <div class="pit-item" id="p?"</div>   where ? is index number corresponding to gameBoard indices
  // id numbering is counter clockwise (direction of play), left-store is zero, bottom left pit is 1, etc. ...
  //  bottom row is numbered (left to right)  p1 to p6
  //  top row is numbered (left to right)   p13 to p8
  //-----------------
  function addPitItem(pNum) {
    let divCell = document.createElement("div");
    divCell.innerText = 4;
    divCell.classList.add("pit-item");
    divCell.setAttribute("id", "p" + pNum);
    return divCell;
  }

  //-----------------
  // createBoard - initialize the game board
  //-----------------
  function createBoard() {
    playerInfo.innerText = "Current player is: " + showName();
    bannerText.innerText = "Ready to play Mancala!";
    let boardGrid = document.getElementById("board-grid");
    if (boardGrid.hasChildNodes()) {
      while (boardGrid.hasChildNodes()) {
        boardGrid.removeChild(boardGrid.firstChild);
      }
    }

    // fill the gameBoard array with initial token count
    gameObj.gameBoard = new Array();
    for (let x = 0; x < 14; x++) {
      if (x == 0 || x == 7) {
        gameObj.gameBoard.push(0);
      } else {
        gameObj.gameBoard.push(4);
      }
    }

    addStore(0, "left"); // add left-store

    // create pit-space, with element id's that are numbered ascending counter-clockwise, corresponding to the boardGame array
    // first loop (top row of egg carton) creates clickable cells left-to-right numbered 13 down to 8
    let pitSection = document.createElement("section");
    pitSection.classList.add("pit-space");

    for (let i = 13; i > 7; i--) {
      let newItem = addPitItem(i);
      newItem.addEventListener("click", (ev) => userAction(ev, newItem));
      pitSection.appendChild(newItem);
    }
    boardGrid.appendChild(pitSection);

    // second loop (bottom row of egg carton) creates clickable cells left-to-right numbered 1 to 8
    for (let i = 1; i < 7; i++) {
      let newItem = addPitItem(i);
      newItem.addEventListener("click", (ev) => userAction(ev, newItem));
      pitSection.appendChild(newItem);
    }
    boardGrid.appendChild(pitSection);

    addStore(7, "right"); // add right-store

    playerInfo.style["text-align"] = "left";
    highlightActivePlayerPits();
  }

  //-----------------
  // isPlayable - determine if the active player is selecting a "playable" pit:  one that is theirs and has 1 or more tokens
  // INPUT:  pNum - integer, the array index the player selected
  // OUTPUT: boolean, true if play can proceed; false if not and display applicable messaging
  //-----------------
  function isPlayable(pNum) {
    let pitCnt = gameObj.gameBoard[pNum];
    if (pNum > 7 && gameObj.currentTurn != "1") {
      bannerText.innerText =
        "Selected pit is not yours. You must select from the other side of the board.";
      return false;
    }
    if (pNum < 7 && gameObj.currentTurn != "2") {
      bannerText.innerText =
        "Selected pit is not yours. You must select from the other side of the board.";
      return false;
    }
    if (pitCnt < 1) {
      bannerText.innerText = "Selected pit is empty.  Please choose another.";
      return false;
    }
    return true;
  }

  //-----------------
  // isIdxOnCurrentSide - determine if an index belongs to the current player's pits (does not include store check)
  // INPUT:  idx - integer, an index into the array
  // OUTPUT: boolean, true if belongs to current player; false otherwise
  //-----------------
  function isIdxOnCurrentSide(idx) {
    if (idx > -1 && idx < 8 && gameObj.currentTurn == "2") {
      return true;
    }
    if (idx > 7 && idx < 14 && gameObj.currentTurn == "1") {
      return true;
    }
    return false;
  } // endFcn isIdxOnCurrentSide

  //-----------------
  // highlightActivePlayerPits - highlight one player's pits and store
  // INPUT:  pWin <== this parameter is OPTIONAL, if supplied it will be 'winner-border' (turns border yellow instead of blue)
  // OUTPUT: none, highlights one player's pits and store with a blue border, removes any other border
  //-----------------
  function highlightActivePlayerPits(pWin) {
    let addThis = "in-play"; // default active border (blue)
    if (pWin != undefined && pWin == "winner-border") {
      addThis = "winner-border"; // winner-border is yellow
    }

    for (let i = 0; i < 14; i++) {
      let updateCell = document.getElementById("p" + i);
      let doThis = "add";
      if (i == 0 && gameObj.currentTurn === "2") {
        doThis = "remove";
      }
      if (i > 0 && i < 8) {
        if (gameObj.currentTurn === "1") {
          doThis = "remove";
        }
      }
      if (i > 7 && i < 14) {
        if (gameObj.currentTurn === "2") {
          doThis = "remove";
        }
      }
      switch (doThis) {
        case "add":
          updateCell.classList.add(addThis);
          break;
        default:
          updateCell.classList.remove("in-play");
      } // endSwitch on doThis
    } // endFor
  } // endFcn

  //-----------------
  // userAction - respond to user input
  // INPUT:  ev - object, event handle of clicked item)
  //         cell - object, cell that caller selected on the boardGrid
  // OUTPUT: none - updates the global gameObj and window display
  //-----------------
  function userAction(ev, cell) {
    if (!gameObj.isGameActive) {
      bannerText.innerText = 'Click on "RESET Game" to play again.';
      return;
    }

    // get target id for the selected cell ('pN') and parse the N into an integer
    let curCellRef = ev.target.id;
    let aryRef = parseInt(curCellRef.substring(1), 10);
    // if selected cell isn't playable, then return
    if (!isPlayable(aryRef)) {
      return;
    }
    // get the current number of pits in the cell and distribute per game rules
    let pitCnt = gameObj.gameBoard[aryRef];
    gameObj.gameBoard[aryRef] = 0;
    cell.innerText = 0;
    let iNext = aryRef;
    for (let y = 1; y <= pitCnt; y++) {
      iNext = aryRef + y;
      if (iNext > 13) {
        iNext = iNext - 14;
      }

      // do not add tokens to other players store
      if (
        (iNext == 0 && gameObj.currentTurn === "2") ||
        (iNext == 7 && gameObj.currentTurn === "1")
      ) {
        iNext++;
        y++;
        pitCnt++;
      }
      gameObj.gameBoard[iNext]++;
      updateCell = document.getElementById("p" + iNext);
      updateCell.innerText = "" + gameObj.gameBoard[iNext];
    } // endFor - token distribution

    // iNext is the index of the last played token, so determine if the player gets another turn (last played in own store),
    //  or if there are other pits to collect (last played in empty pit on own players side)
    if (iNext != 0 && iNext != 7 && gameObj.gameBoard[iNext] == 1) {
      if (isIdxOnCurrentSide(iNext)) {
        let winnerStore = gameObj.currentTurn == "2" ? 7 : 0;
        let iTakeFromIdx = objOppositePit[iNext];
        let iTake = gameObj.gameBoard[iTakeFromIdx]; // number of tokens on oppsite side

        // update the current players store with opposing players tokens + the single one
        gameObj.gameBoard[winnerStore] += iTake; // add opposite tokens to current store
        gameObj.gameBoard[winnerStore]++; // add the single token belonging to current player
        // update board display for current player store
        updateCell = document.getElementById("p" + winnerStore);
        updateCell.innerText = "" + gameObj.gameBoard[winnerStore];
        // update gameBoard and board-grid with the removal of other players tokens
        gameObj.gameBoard[iTakeFromIdx] = 0;
        updateCell = document.getElementById("p" + iTakeFromIdx);
        updateCell.innerText = "" + gameObj.gameBoard[iTakeFromIdx];
        // update gameBoard and board-grid with the removal of current players single token
        gameObj.gameBoard[iNext] = 0;
        updateCell = document.getElementById("p" + iNext);
        updateCell.innerText = "" + gameObj.gameBoard[iNext];
      }
    }

    // check to see if all pits on either side are now 0
    checkForWinner();
    if (!gameObj.isGameActive) {
      return;
    }
    // if iNext (last token) was played in own player's store, then get another turn
    if (
      (iNext == 0 && gameObj.currentTurn == "1") ||
      (iNext == 7 && gameObj.currentTurn == "2")
    ) {
      bannerText.innerText = "You get another turn!";
      return;
    }
    // if the game isn't over (by tie or winner), then change whose turn it is
    if (gameObj.isGameActive) {
      gameObj.currentTurn = gameObj.currentTurn == "1" ? "2" : "1";
      playerInfo.innerText = "Current player is: " + showName();
      playerInfo.style["text-align"] =
        gameObj.currentTurn == "1" ? "left" : "right";
      highlightActivePlayerPits();
      bannerText.innerText = "-";
    }
  } // endFcn userAction

  //-----------------
  // checkForWinner - determine if all the pits on either side are 0, and if so, apportion remaining tokens to the pit owner
  // INPUT//OUTPUT: none - updates the global gameObj and window display
  //-----------------
  function checkForWinner() {
    let bPlayerWon = true;
    let iEmptySide = 2;
    // check Player 1 pits (1 to 6)
    for (let i = 1; i < 7; i++) {
      if (gameObj.gameBoard[i] != 0) {
        bPlayerWon = false;
        iEmptySide = 0;
        break;
      }
    }
    // check Player 2 pits (8 to 13)
    if (!bPlayerWon) {
      bPlayerWon = true;
      iEmptySide = 1;
      for (let i = 8; i < 14; i++) {
        if (gameObj.gameBoard[i] != 0) {
          bPlayerWon = false;
          iEmptySide = 0;
          break;
        }
      }
    }

    // if someone won, then empty the remaining token's into their owner's store (OWNER, not necessarily the winner)
    if (bPlayerWon) {
      gameObj.isGameActive = false;
      let iStart = iEmptySide == 1 ? 1 : 8;
      let iEnd = iEmptySide == 1 ? 7 : 14;
      let iTake = 0;
      let winnerStore = iEmptySide == 1 ? 7 : 0;
      let updateCell = new Object();
      for (let i = iStart; i < iEnd; i++) {
        if (gameObj.gameBoard[i] != 0) {
          iTake += gameObj.gameBoard[i];
          gameObj.gameBoard[i] = 0;
          updateCell = document.getElementById("p" + i);
          updateCell.innerText = 0;
        }
      }
      gameObj.gameBoard[winnerStore] += iTake;
      updateCell = document.getElementById("p" + winnerStore);
      updateCell.innerText = gameObj.gameBoard[winnerStore];

      if (gameObj.gameBoard[0] == gameObj.gameBoard[7]) {
        bannerText.innerText = "TIE GAME!";
        return;
      }
      if (gameObj.gameBoard[0] > gameObj.gameBoard[7]) {
        gameObj.currentTurn = "1";
      } else {
        gameObj.currentTurn = "2";
      }
      console.log("winner is " + gameObj.currentTurn);
      highlightActivePlayerPits("winner-border");
      bannerText.innerText = showName() + " WON this game!";
    }
  }

  createBoard();
});
