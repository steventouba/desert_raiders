const Level = require('../game/level.js');
const State = require('../game/state.js');
const keys = require('../utils/keybindings.js');

function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = .5;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, keys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}

exports.runGame = async function(plans, Display) {
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]), Display);
    if (status == "won") {
      console.log(`You beat level ${level + 1}`);
      level++;
    }
  }
  let canvasEl = document.createElement("canvas");
  let parent = document.getElementById("canvas-container");
  parent.appendChild(canvasEl);
  canvasEl.width = 950;
  canvasEl.height = 550;
  let cx = canvasEl.getContext("2d");
  let grd = cx.createLinearGradient(0, 0, 800, 0);
  grd.addColorStop(0, "gold");
  grd.addColorStop(1, "white");
  cx.fillStyle = grd;
  cx.fillRect(0, 0, 950, 550)
  cx.font = "60px 'Uncial Antiqua', cursive";
  cx.fillStyle = "black";
  cx.textAlign = "center";
  cx.fillText("👑 YOU GO GIRL 👑", 475, 275)

  document.getElementById("level").textContent = `You Won! 🎉`
  console.log("You've won!");
}