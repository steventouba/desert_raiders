const CanvasDisplay = require('./render/canvas.js');
const Engine = require('./engine/engine.js');


document.addEventListener("DOMContentLoaded", function () {

  Engine.runGame(GAME_LEVELS, CanvasDisplay)

});

let GAME_LEVELS = [`
........................../........................../........................../........................../........................../........................../@..|...C............|...../############TT####TT######/##########################`];
