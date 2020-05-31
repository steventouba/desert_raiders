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

function runLevel(level, Display, heroId) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = .2;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, keys);
      display.syncState(state, heroId);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        score -= score; 
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}

exports.runGame = async function(plans, Display, heroId) {
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]), Display, heroId);
    if (status == "won") {
      level++;
      background.src = `./dist/sprites/background/background${(level % 4)}.png`
      const levelId = document.getElementById('level-id');
      levelId.innerHTML = `Level ${level + 1}` 
      console.log(totalScore)
    }
  }
  
  let canvasEl = document.createElement("canvas")
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
  cx.font = "40px 'Uncial Antiqua', cursive";
  cx.fillStyle = "black";
  cx.textAlign = "center";
  cx.fillText(" YOU WON!  ", 475, 150)
  cx.fillText(" What did you expect a cookie? ", 475, 250)
  cx.fillText(" It's not called dessert raiders. ", 475, 350)
  document.getElementById("level-id").remove();
};
