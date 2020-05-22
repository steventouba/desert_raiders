const CanvasDisplay = require('./render/canvas.js');
const Engine = require('./engine/engine.js');


document.addEventListener("DOMContentLoaded", function () {
  
  document.getElementById("hero-select").addEventListener("click", function() {
    let heroId = event.target.dataset.hero;
    let hero = document.getElementById("hero-select");
    debugger
    hero.remove();
    Engine.runGame(GAME_LEVELS, CanvasDisplay, heroId)
  })

});

let GAME_LEVELS = [`
........................../........................../........................../........................../........................../........................./@..|...EPR......MSB...|...../############tt###tt######/##########################`,
`........................../........................../........................../........................../........................./........................./@..|...EPR.........|...../###########tt###tt######/##########################`
];
