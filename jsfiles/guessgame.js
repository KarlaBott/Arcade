window.addEventListener("DOMContentLoaded", () => {
  let myGameObj = new Object();
  let winNum = -1;

  let btnReset = document.getElementById("btnReset");
  let btnHint = document.getElementById("btnHint");
  let userInput = document.getElementById("user-input");
  let bannerText = document.querySelector(".banner");
  let playerInfo = document.querySelector(".active-player");

  userInput.addEventListener("keypress", function (event) {
    //  console.log("Enter keyPress hit");
    if (event.key === "Enter") {
      event.preventDefault();
      // if there is no existing object, then make one and establish a value for winNum
      if (Object.keys(myGameObj).length === 0) {
        initGame();
      }
      //alert(' and you entered : ' + userInput.value);
      let retText = myGameObj.playersGuessSubmission(userInput.value);
      bannerText.innerText = retText;
      fillPlayerGuessDisplay();
      userInput.value = "";
      playerInfo.innerText = "Current player is: " + showName();
    }
  });

  // return the player name from sessionStorage variables  (currentTurn is either '1' or '2')
  function showName() {
    return "Player 1 - " + window.sessionStorage.getItem("glbName1");
  }

  function fillPlayerGuessDisplay() {
    let guessDisplay = document.getElementById("guesses");
    if (guessDisplay.hasChildNodes()) {
      while (guessDisplay.firstChild) {
        guessDisplay.removeChild(guessDisplay.firstChild);
      }
    }
    let data = myGameObj.pastGuesses;
    for (i = 0; i < 5; i++) {
      let li = document.createElement("li");
      if (data[i] == undefined) {
        li.innerText = " - ";
      } else {
        li.innerText = data[i];
      }
      guessDisplay.appendChild(li);
    }
  }

  function fillHintDisplay() {
    let hintDisplay = document.getElementById("hints");
    if (hintDisplay.hasChildNodes()) {
      while (hintDisplay.firstChild) {
        hintDisplay.removeChild(hintDisplay.firstChild);
      }
    }
    let data = myGameObj.provideHint();
    for (i = 0; i < data.length; i++) {
      let li = document.createElement("li");
      li.innerText = data[i];
      hintDisplay.appendChild(li);
    }
  }

  btnReset.addEventListener("click", function () {
    location.reload();
  });

  btnHint.addEventListener("click", function () {
    if (Object.keys(myGameObj).length === 0) {
      bannerText.innerText =
        "You must enter at least one guess before you can get a hint.";
    } else if (myGameObj.gameOver) {
      bannerText.innerText =
        "Game over.  Click RESET button to start a new game.  Winning number was " +
        winNum +
        ".";
    } else {
      fillHintDisplay();
    }
  });

  // getRandomInt - return random integer from 0 to max
  function generateWinningNumber() {
    let randomNum = Math.floor(Math.random() * 100); // int between 0 and 99
    randomNum++; // add 1 to make it 1 to 100
    return randomNum;
  }

  const game = {
    newGame() {
      let gameObj = {
        playerGuess: null,
        pastGuesses: new Array(),
        gameOver: false,
        winningNumber() {
          let x = generateWinningNumber();
          return x;
        },
        difference() {
          let diff = Math.abs(this.playerGuess - winNum);
          return diff;
        },
        playersGuessSubmission(guessNum) {
          if (this.gameOver)
            return (
              "Game over.  Click RESET button to start a new game.  Winning number was " +
              winNum +
              "."
            );
          guessNum = Number(guessNum);
          if (guessNum >= 1 && guessNum <= 100 && Number.isInteger(guessNum)) {
            this.playerGuess = guessNum;
            return this.checkGuess();
          } else {
            return "Invalid entry.  Enter a number between 1 and 100, inclusive.";
          }
        },
        checkGuess() {
          if (this.playerGuess === winNum) {
            this.gameOver = true;
            this.pastGuesses.push(this.playerGuess);
            return "You Win!";
          }
          if (this.pastGuesses.includes(this.playerGuess))
            return "You have already guessed that number.";
          this.pastGuesses.push(this.playerGuess);
          if (this.pastGuesses.length == 5) {
            this.gameOver = true;
            return (
              "You Lose.  Maximum number of attempts reached.  Winning number was:  " +
              winNum +
              "."
            );
          }
          let ckDiff = this.difference();
          if (ckDiff < 10) {
            if (winNum < this.playerGuess)
              return "You're burning up! Less than 10 away. Guess lower.";
            else return "You're burning up! Less than 10 away. Guess higher.";
          }
          if (ckDiff < 25) {
            if (winNum < this.playerGuess)
              return "You're lukewarm.  Less than 25 away. Guess lower.";
            else return "You're lukewarm.  Less than 25 away. Guess higher.";
          }
          if (ckDiff < 50) {
            if (winNum < this.playerGuess) return "You're chilly. Guess lower.";
            else return "You're chilly. Guess higher.";
          }
          return "You're ice cold.";
        },
        provideHint() {
          let newAry = new Array();
          newAry[0] = winNum;
          for (let x = 1; x < 4; x++) {
            let newNum = generateWinningNumber();
            while (newAry.includes(newNum)) {
              newNum = generateWinningNumber();
            }
            newAry[x] = newNum;
          }
          return shuffle(newAry);
        },
      };
      return gameObj;
    },
  };

  function shuffle(array) {
    let m = array.length,
      t,
      i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  function initGame() {
    bannerText.innerText =
      "Ready to play Number Mastermind! Type your first guess in the white box.";
    myGameObj = game.newGame();
    winNum = myGameObj.winningNumber();
    playerInfo.innerText = "Current player is: " + showName();
    userInput.value = "Num ?";
    fillPlayerGuessDisplay();
  }

  initGame();
});
