window.addEventListener("DOMContentLoaded", () => {
  let score = 0;

  const playerInfo = document.querySelector(".active-player");
  const scoreDisplay = document.getElementById("score");
  const holes = document.getElementsByClassName("hole");
  let bannerText = document.querySelector(".banner");
  let btnReset = document.getElementById("btnReset");

  // return the player name from sessionStorage variable
  function showName() {
    return "Player 1 - " + window.sessionStorage.getItem("glbName1");
  }

  setInterval(function () {
    const randomHoleIndex = Math.floor(Math.random() * holes.length);
    holes[randomHoleIndex].classList.toggle("mole");
  }, 300);

  const gameArea = document.getElementById("whack-a-mole");
  gameArea.addEventListener("click", function (clickEvent) {
    if (clickEvent.target.matches(".mole")) {
      // we hit a mole!
      clickEvent.target.classList.remove("mole");
      score++;
      scoreDisplay.innerText = 'Score: '+ score;
    }
  });

  function initGame() {
    score = 0;
    bannerText.innerText = 'Ready to play Whack-A-Mole! ' +  String.fromCharCode(160) + String.fromCharCode(160) + ' Click on any mole to START game.';
    playerInfo.innerText = "Current player is: " + showName();
  }

  btnReset.addEventListener('click', function() {
    location.reload();
  });
  
  initGame();
});
