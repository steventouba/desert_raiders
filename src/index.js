const CanvasDisplay = require('./render/canvas.js');
const Engine = require('./engine/engine.js');


document.addEventListener("DOMContentLoaded", function () {
  
  document.getElementById("hero-select").addEventListener("click", function() {
    const heroId = event.target.dataset.hero;
    const hero = document.getElementById("hero-select");
    const info = document.getElementById("background-info");
    info.remove();
    hero.remove();
    Engine.runGame(GAME_LEVELS, CanvasDisplay, heroId)
  })

});

const GAME_LEVELS = [`
........................../........................../........................../........................../........................../........................./@..|...EPR.....MSB...|...../############tt###tt######/##########################`,
`........................../........................../........................../........................../........................./........................./@..|...EPR.........|...../###########tt###tt######/##########################`
];
