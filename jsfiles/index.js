window.addEventListener("DOMContentLoaded", () => {
  const p1name = document.getElementById("p1name");
  const p2name = document.getElementById("p2name");

  //-----------------
  // checkdefaultPlayerNames - check to see if Player names already exist
  // INPUT:    none - uses global sessions variables
  // OUTPUT:   none - get / set default names for Player 1 (Self), and Player 2 (NotComputer)on
  //-----------------
  function checkdefaultPlayerNames() {
    // default Player 1 to 'Self' if does not exist
    // default Player 2 to 'NotComputer' if does not exist
    for (let x = 1; x < 3; x++) {
      let thisNameObj = x == 1 ? p1name : p2name;
      let selectedName = window.sessionStorage.getItem("glbName" + x);
      console.log("x is " + x + " and selName is " + selectedName);
      console.log(JSON.stringify(thisNameObj));
      if (selectedName == null || selectedName.length < 1) {
        console.log("setting a default");
        thisNameObj.value = x == 1 ? "Self" : "NotComputer";
        window.sessionStorage.setItem("glbName" + x, thisNameObj.value);
      } else {
        thisNameObj.value = selectedName;
      }
    }
  } // endFcn checkdefaultPlayerNames

  //-----------------
  // setPlayerName - set new Player name based on user input from Input object
  // INPUT:    thisNameId - string, corresponds to the Input object for player names, either 'p1name' or 'p2name'
  //   if input = '3323kb', then display a test sandbox button (used just for me to do test development on a page)
  // OUTPUT:   none - set selected player name
  //-----------------
  function setPlayerName(thisNameId, name) {
    let thisNameObj = thisNameId == "p1name" ? p1name : p2name; // get the selected element object
    let nameChar = thisNameId.charAt(1); // get single char, either '1' or '2', from thisNameId
    if (thisNameObj.value.length < 1) {
      thisNameObj.value = nameChar == "1" ? "Self" : "NotComputer"; // no entry defaults to 'Self' or 'NotComputer'
      window.sessionStorage.setItem("glbName" + nameChar, thisNameObj.value);
    } else {
      window.sessionStorage.setItem("glbName" + nameChar, thisNameObj.value);
    }
    console.log("glbName1:", window.sessionStorage.getItem("glbName1"));
    console.log("glbName2:", window.sessionStorage.getItem("glbName2"));
    // allow access to a test page button
    let anObj = document.getElementById("test-stuff");
    if (nameChar == "1" && thisNameObj.value == "3323kb") {
      anObj.classList.remove("hide");
    } else {
      anObj.classList.add("hide");
    }
  } // endFcn setPlayerName

  p1name.addEventListener("keydown", function (event) {
    console.log("Enter 1 keyPress hit");
    if (event.key == "Enter" || event.key == "Tab") {
      event.preventDefault();
      setPlayerName(event.target.id);
      p2name.focus();
    }
  });

  p2name.addEventListener("keydown", function (event) {
    console.log("Enter 2 keyPress hit");
    if (event.key == "Enter" || event.key == "Tab") {
      event.preventDefault();
      setPlayerName(event.target.id);
    }
  });

  checkdefaultPlayerNames();
});
