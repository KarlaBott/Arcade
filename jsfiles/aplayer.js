window.addEventListener("DOMContentLoaded", () => {
  const playerInfo = document.querySelector(".active-player");
  const btnReset = document.querySelector("#btnReset");
  const bannerText = document.querySelector(".banner");
  // const box3 = document.getElementById("inBox3");
  const box3 = document.getElementById("p3box");

  btnReset.addEventListener("click", function (event) {
    location.reload();
  });

  const select1 = document.getElementById("select1");
  const select2 = document.getElementById("select2");
  const p1name = document.getElementById("p1name");
  const p2name = document.getElementById("p2name");

  // document.getElementById("pets").options[2].disabled = true;

  // function setPlayerName(thisNameId) {
  //   let thisNameObj = thisNameId == "p1name" ? p1name : p2name;   // get the element object

  function changeColor (thisNameId) {
    let thisNameObj = thisNameId == "select1" ? select1 : select2;   // get the selected player's obj ref - player choosing a color
    let theOtherObj = thisNameId == "select1" ? select2 : select1;    // get the other player's object ref
    let chosenColor = thisNameObj.value;
    console.log('chosenColor = ' + chosenColor);
    let opt1 = thisNameObj.selectedIndex;
    // re-enable all colors for other player
    for (let x = 0; x < theOtherObj.options.length; x++) {
      theOtherObj.options['' + x].disabled = false;
    }
    theOtherObj.options[opt1].disabled = true;
    let box = document.getElementById(thisNameId == "select1" ? "plbox" : "p2box");
    box.removeAttribute("class");
    box.classList.add("box", chosenColor);
  }

  select1.addEventListener("change", function (event) {
    bannerText.innerText = 'change color of P 1 box';
    changeColor(event.target.id);
  });

  select2.addEventListener("change", function (event) {
    bannerText.innerText = 'change color of P 2 box';
    changeColor(event.target.id);
  });

  p1name.addEventListener("keypress", function(event) {
    //  console.log("Enter 1 keyPress hit");
    if (event.key === "Enter") {
      event.preventDefault();
      let retText = p1name.value;
      if (retText.toUpperCase() == 'CAT') {
 //       box3.classList.add('cimg');
 //       box3.classList.add('letc');
 //       box3.innerText = 'C';
      } else {
  //      box3.classList.remove('cimg');
 //       box3.classList.remove('letc')
        box3.innerText = '';
      }
      playerInfo.innerText = 'Current player is now: '+ retText;
      bannerText.innerText = 'changed Player 1 name';
    }
  });

  p2name.addEventListener("keypress", function(event) {
    //  console.log("Enter 1 keyPress hit");
    if (event.key === "Enter") {
      event.preventDefault();
      let retText = p2name.value;
      playerInfo.innerText = 'Current player is now: '+ retText;
      bannerText.innerText = 'changed Player 2 name';
    }
  });
});
