/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/actors/door.js":
/*!****************************!*\
  !*** ./src/actors/door.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Vector = __webpack_require__(/*! ../game/vector.js */ \"./src/game/vector.js\");\nconst State = __webpack_require__(/*! ../game/state.js */ \"./src/game/state.js\");\n\nclass Door {\n\n  constructor(pos) {\n    this.pos = pos;\n  }\n\n  get type() { return \"door\"; }\n\n  static create(pos) {\n    return new Door(pos.plus(new Vector(-0.1, -0.2)),\n      new Vector(0, 0));\n  }\n\n}\n\nDoor.prototype.size = new Vector(1, 1.2)\n\nDoor.prototype.collide = function (state) {\n  return new State(state.level, state.actors, \"won\");\n};\n\nDoor.prototype.update = function (time) {\n  return new Door(this.pos)\n}\n\nmodule.exports = Door; \n\n\n//# sourceURL=webpack:///./src/actors/door.js?");

/***/ }),

/***/ "./src/actors/enemy.js":
/*!*****************************!*\
  !*** ./src/actors/enemy.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Vector = __webpack_require__(/*! ../game/vector.js */ \"./src/game/vector.js\");\nconst State = __webpack_require__(/*! ../game/state.js */ \"./src/game/state.js\");\n\nclass Enemy {\n  constructor(pos, speed, ch) {\n    this.pos = pos;\n    this.speed = speed;\n    this.spriteImage = typeof ch === 'number' ? ch : this.chooseSpriteImage(ch);\n  }\n\n  get type() { return \"enemy\"; }\n\n  chooseSpriteImage(ch) {\n    switch (ch) {\n      case \"M\":\n        return 0;\n      case \"S\":\n        return 1;\n      case \"B\":\n        return 2;\n      default:\n        return 0;\n    }\n  }\n\n  static create(pos, ch) {\n    return new Enemy(pos.plus(new Vector(0, -0.6)), new Vector(2, 0), ch)\n  }\n}\n\nEnemy.prototype.size = new Vector(1.25, 1.6);\n\nEnemy.prototype.update = function (time, state) {\n  let newPos = this.pos.plus(this.speed.times(time));\n  if (!state.level.touches(newPos, this.size, \"invisibleWall\")) {\n    return new Enemy(newPos, this.speed, this.spriteImage);\n  } else {\n    return new Enemy(this.pos, this.speed.times(-1), this.spriteImage);\n  }\n};\n\nEnemy.prototype.collide = function (state) {\n  let filtered = state.actors.filter(a => a != this);\n  let player = state.actors.filter(a => a.type == \"player\").shift();\n  let status = state.status;\n  if (player.slashing) {\n    return new State(state.level, filtered, status);\n  } else {\n    return new State(state.level, state.actors, \"lost\");\n  }\n}\n\nmodule.exports = Enemy; \n\n\n//# sourceURL=webpack:///./src/actors/enemy.js?");

/***/ }),

/***/ "./src/actors/player.js":
/*!******************************!*\
  !*** ./src/actors/player.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Vector = __webpack_require__(/*! ../game/vector.js */ \"./src/game/vector.js\");\nconst State = __webpack_require__(/*! ../game/state.js */ \"./src/game/state.js\");\n\nclass Player {\n\n  constructor(pos, speed, slashing) {\n    this.pos = pos;\n    this.speed = speed;\n    this.slashing = slashing;\n  }\n\n  get type() { return \"player\"; }\n\n  static create(pos) {\n    return new Player(pos.plus(new Vector(0, -0.6)), new Vector(0, 0));\n  }\n\n}\n\nPlayer.prototype.size = new Vector(0.8, 1.6) // this in tandem with the static create offsets the player character the appropriate distance so it sits on top of the block below\n\nconst playerXSpeed = 7;\nconst gravity = 30;\nconst jumpSpeed = 14.5;\nconst enemyXSpeed = 7;\n\nPlayer.prototype.update = function (time, state, keys) {\n  let xSpeed = 0;\n  let slashing = false;\n  if (keys.a) xSpeed -= playerXSpeed;\n  if (keys.d) xSpeed += playerXSpeed;\n  if (keys.Shift) slashing = true;\n  let pos = this.pos;\n  let movedX = pos.plus(new Vector(xSpeed * time, 0));\n  if (!state.level.touches(movedX, this.size, \"wall\")) {\n    pos = movedX;\n  }\n  let ySpeed = this.speed.y + time * gravity;\n  let movedY = pos.plus(new Vector(0, ySpeed * time));\n\n  if (!state.level.touches(movedY, this.size, \"wall\")) {\n    pos = movedY;\n  } else if (keys.w && ySpeed > 0) {\n    ySpeed = -jumpSpeed;\n  } else {\n    ySpeed = 0;\n  }\n  return new Player(pos, new Vector(xSpeed, ySpeed), slashing);\n};\n\nmodule.exports = Player; \n\n\n//# sourceURL=webpack:///./src/actors/player.js?");

/***/ }),

/***/ "./src/actors/treasure.js":
/*!********************************!*\
  !*** ./src/actors/treasure.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Vector = __webpack_require__(/*! ../game/vector.js */ \"./src/game/vector.js\");\nconst State = __webpack_require__(/*! ../game/state.js */ \"./src/game/state.js\");\n\nclass Treasure {\n  constructor(pos, basePos, wobble, ch) {\n    this.pos = pos;\n    this.basePos = basePos;\n    this.wobble = wobble;\n    this.spriteImage = typeof ch === 'number' ? ch : this.chooseSpriteImage(ch);\n  }\n\n  get type() { return \"treasure\"; }\n\n  chooseSpriteImage(ch) { \n    switch (ch) {\n      case \"P\":\n        return 0;\n      case \"R\":\n        return 1; \n      case \"E\": \n        return 2;\n      default:\n        return 0;\n    }\n  }\n\n  static create(pos, ch) {\n    let basePos = pos.plus(new Vector(0.2, 0.1));\n    return new Treasure(basePos, basePos, (Math.random() * Math.PI * 2), ch);\n  }\n}\n\nTreasure.prototype.size = new Vector(0.45, 0.6);\n\nTreasure.prototype.collide = function (state) {\n  const coinSound = document.getElementById('coins'); \n  coinSound.play();\n  let filtered = state.actors.filter(a => a != this);\n  let status = state.status;\n  if (!filtered.some(a => a.type == \"treasure\")) status = \"won\";\n  return new State(state.level, filtered, status);\n};\n\nconst wobbleSpeed = 8, wobbleDist = 0.07;\n\nTreasure.prototype.update = function (time) {\n  let wobble = this.wobble + time * wobbleSpeed;\n  let wobblePos = Math.sin(wobble) * wobbleDist;\n  return new Treasure(\n    this.basePos.plus(new Vector(0, wobblePos)),\n    this.basePos, wobble, this.spriteImage\n  );\n};\n\nmodule.exports = Treasure; \n\n\n//# sourceURL=webpack:///./src/actors/treasure.js?");

/***/ }),

/***/ "./src/engine/engine.js":
/*!******************************!*\
  !*** ./src/engine/engine.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Level = __webpack_require__(/*! ../game/level.js */ \"./src/game/level.js\");\nconst State = __webpack_require__(/*! ../game/state.js */ \"./src/game/state.js\");\nconst keys = __webpack_require__(/*! ../utils/keybindings.js */ \"./src/utils/keybindings.js\");\n\nfunction runAnimation(frameFunc) {\n  let lastTime = null;\n  function frame(time) {\n    if (lastTime != null) {\n      let timeStep = Math.min(time - lastTime, 100) / 1000;\n      if (frameFunc(timeStep) === false) return;\n    }\n    lastTime = time;\n    requestAnimationFrame(frame);\n  }\n  requestAnimationFrame(frame);\n}\n\nfunction runLevel(level, Display, heroId) {\n  let display = new Display(document.body, level);\n  let state = State.start(level);\n  let ending = .5;\n  return new Promise(resolve => {\n    runAnimation(time => {\n      state = state.update(time, keys);\n      display.syncState(state, heroId);\n      if (state.status == \"playing\") {\n        return true;\n      } else if (ending > 0) {\n        ending -= time;\n        return true;\n      } else {\n        display.clear();\n        resolve(state.status);\n        return false;\n      }\n    });\n  });\n}\n\nexports.runGame = async function(plans, Display, heroId) {\n  for (let level = 0; level < plans.length;) {\n    let status = await runLevel(new Level(plans[level]), Display, heroId);\n    if (status == \"won\") {\n      level++;\n      background.src = `./dist/sprites/background/background${(level % 4)}.png`\n      const levelId = document.getElementById('level-id');\n      levelId.innerHTML = `Level ${level + 1}` \n    }\n  }\n  \n  let canvasEl = document.createElement(\"canvas\")\n  let parent = document.getElementById(\"canvas-container\");\n  parent.appendChild(canvasEl);\n  canvasEl.width = 950;\n  canvasEl.height = 550;\n  let cx = canvasEl.getContext(\"2d\");\n  let grd = cx.createLinearGradient(0, 0, 800, 0);\n  grd.addColorStop(0, \"gold\");\n  grd.addColorStop(1, \"white\");\n  cx.fillStyle = grd;\n  cx.fillRect(0, 0, 950, 550)\n  cx.font = \"60px 'Uncial Antiqua', cursive\";\n  cx.fillStyle = \"black\";\n  cx.textAlign = \"center\";\n  cx.fillText(\" YOU WON! \", 475, 275)\n\n  // document.getElementById(\"level\").textContent = `You Won! 🎉`\n}\n\n//# sourceURL=webpack:///./src/engine/engine.js?");

/***/ }),

/***/ "./src/game/level.js":
/*!***************************!*\
  !*** ./src/game/level.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Player = __webpack_require__(/*! ../actors/player.js */ \"./src/actors/player.js\");\nconst Enemy = __webpack_require__(/*! ../actors/enemy.js */ \"./src/actors/enemy.js\");\nconst Door = __webpack_require__(/*! ../actors/door.js */ \"./src/actors/door.js\");\nconst Treasure = __webpack_require__(/*! ../actors/treasure.js */ \"./src/actors/treasure.js\");\nconst Vector = __webpack_require__(/*! ./vector.js */ \"./src/game/vector.js\");\n\nconst levelChars = {\n  \".\": \"empty\",\n  \"#\": \"wall\",\n  \"|\": \"invisibleWall\",\n  \"+\": \"lava\",\n  \"~\": \"lavaTop\",\n  \"t\": \"trap\",\n  \"D\": Door,\n  \"M\": Enemy,\n  \"S\": Enemy,\n  \"B\": Enemy,\n  \"@\": Player,\n  \"P\": Treasure,\n  \"R\": Treasure,\n  \"E\": Treasure,\n};\n\nclass Level {\n\n  constructor(plan) {\n    let rows = plan.trim().split(\"/\").map(l => [...l]);\n    this.height = rows.length;\n    this.width = rows[0].length;\n    this.startActors = [];\n\n    this.rows = rows.map((row, y) => {\n      return row.map((ch, x) => {\n        let type = levelChars[ch];\n        if (typeof type === \"string\") return type;\n\n        if (type == Door) {\n          this.startActors.unshift(\n            type.create(new Vector(x, y), ch)\n          );\n        } else {\n          this.startActors.push(\n            type.create(new Vector(x, y), ch));\n        }\n        return \"empty\";\n      });\n    });\n  }\n}\n\nLevel.prototype.touches = function (pos, size, type) {\n  var xStart = Math.floor(pos.x);\n  var xEnd = Math.ceil(pos.x + size.x);\n  var yStart = Math.floor(pos.y);\n  var yEnd = Math.ceil(pos.y + size.y);\n\n  for (var y = yStart; y < yEnd; y++) {\n    for (var x = xStart; x < xEnd; x++) {\n      let isOutside = x < 0 || x >= this.width ||\n        y < 0 || y >= this.height;\n      let here = isOutside ? \"wall\" : this.rows[y][x];\n      if (here == type) return true;\n    }\n  }\n  return false;\n};\n\nmodule.exports = Level; \n\n//# sourceURL=webpack:///./src/game/level.js?");

/***/ }),

/***/ "./src/game/state.js":
/*!***************************!*\
  !*** ./src/game/state.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Util = __webpack_require__(/*! ../utils/util.js */ \"./src/utils/util.js\")\n\nclass State {\n\n  constructor(level, actors, status) {\n    this.level = level;\n    this.actors = actors;\n    this.status = status;\n  }\n\n  static start(level) {\n    return new State(level, level.startActors, \"playing\");\n  }\n\n  get player() {\n    return this.actors.find(a => a.type == \"player\");\n  }\n}\n\nState.prototype.update = function (time, keys) {\n  let actors = this.actors\n    .map(actor => actor.update(time, this, keys));\n  let newState = new State(this.level, actors, this.status);\n\n  if (newState.status != \"playing\") return newState;\n\n  let player = newState.player;\n  if (this.level.touches(player.pos, player.size, \"lava\")) {\n    console.log('lost')\n    return new State(this.level, actors, \"lost\");\n  }\n\n  if (this.level.touches(player.pos, player.size, \"lavaTop\")) {\n    console.log('lost')\n    return new State(this.level, actors, \"lost\");\n  }\n\n  if (this.level.touches(player.pos, player.size, \"trap\")) {\n    return new State(this.level, actors, \"lost\");\n  }\n\n  for (let actor of actors) {\n    if (actor != player && Util.overlap(actor, player)) {\n      newState = actor.collide(newState);\n    }\n  }\n  return newState;\n};\n\nmodule.exports = State; \n\n\n//# sourceURL=webpack:///./src/game/state.js?");

/***/ }),

/***/ "./src/game/vector.js":
/*!****************************!*\
  !*** ./src/game/vector.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nclass Vector {\n\n  constructor(x, y) {\n    this.x = x; this.y = y;\n  }\n\n  plus(other) {\n    return new Vector(this.x + other.x, this.y + other.y);\n  }\n\n  times(factor) {\n    return new Vector(this.x * factor, this.y * factor);\n  }\n\n}\n\nmodule.exports = Vector; \n\n\n//# sourceURL=webpack:///./src/game/vector.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const CanvasDisplay = __webpack_require__(/*! ./render/canvas.js */ \"./src/render/canvas.js\");\nconst Engine = __webpack_require__(/*! ./engine/engine.js */ \"./src/engine/engine.js\");\n\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  \n  document.getElementById(\"hero-select\").addEventListener(\"click\", function() {\n    const heroId = event.target.dataset.hero;\n    const hero = document.getElementById(\"hero-select\");\n    const info = document.getElementById(\"background-info\");\n    info.remove();\n    hero.remove();\n    Engine.runGame(GAME_LEVELS, CanvasDisplay, heroId)\n  })\n\n});\n\nconst GAME_LEVELS = [\n  \"................................../................................../.....P....R.R...................../....##....###...................P./................................../@........|M.....|.R.|M..E...E..|../##################################/##################################/##################################\", \n  \"................................../.....................P............/.....P..............##....E......./....##...................###....P./............R.R...............#.../@..|..M...|.###.........E...E...../##########tttttt##################/##########tttttt##################/##################################\", \n  \"................................../................................../............................P...../................................../....P...P......R...........P.P..../....#.........##...........#.#..../...###.....##..#..........##E##.../@.##t##.....#tt#|B......|#######../##################################\",\n  \"................................../................................../.........P...............P......../........##..............##......../....P..........R....E............./....#.........##...###.....#.#..../...###.....#####..........##E##.../@.#####ttttt####|B......|#######../#######ttttt######################\",\n  \"................................../................................../.........................R..P...../.........................#.##...../@.|M..|....|B.....|..|R.......S.|./#######.#ttt#######..#############/#######..............#############/#######...E.E.R.P...##############/##################################\"\n];\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/render/canvas.js":
/*!******************************!*\
  !*** ./src/render/canvas.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nconst scale = 64;\nconst playerXOverlap = 38;\nconst playerYOverlap = 10;\nconst enemyXOverlap = 38;\nconst enemyYOverlap = 10;\n\nconst minionSprites = document.createElement(\"img\");\nminionSprites.src = \"./dist/sprites/enemies/satyr1.png\";\n\nconst shamanSprites = document.createElement(\"img\");\nshamanSprites.src = \"./dist/sprites/enemies/satyr2.png\";\n\nconst bigBossSprites = document.createElement(\"img\");\nbigBossSprites.src = \"./dist/sprites/enemies/satyr3.png\";\n\nconst playerSprites = document.createElement(\"img\");\nplayerSprites.src = \"./dist/sprites/heroes/heroine.png\";\n\nconst slashingSprites = document.createElement(\"img\");\nslashingSprites.src = \"./dist/sprites/heroes/heroine_attack.png\";\n\nconst tiles = document.createElement(\"img\");\ntiles.src = \"./dist/sprites/tiles.png\";\n\nconst items = document.createElement(\"img\"); \nitems.src = \"./dist/sprites/items.png\";\n\nwindow.background = document.createElement(\"img\");\nbackground.src = \"./dist/sprites/background/background0.png\";\n\nclass CanvasDisplay {\n  constructor() {\n    this.canvas = document.createElement(\"canvas\");\n    let parent = document.getElementById(\"canvas-container\");\n    parent.appendChild(this.canvas); \n    this.canvas.width = 950;\n    this.canvas.height = 550;\n    this.cx = this.canvas.getContext(\"2d\");\n    this.flipPlayer = false;\n    this.flipEnemy = false;\n    this.viewport = {\n      left: 0,\n      top: 0,\n      width: this.canvas.width / scale,\n      height: this.canvas.height / scale\n    };\n  }\n\n  clear() {\n    this.canvas.remove();\n  }\n}\n\nCanvasDisplay.prototype.syncState = function (state, heroId) {\n   if (parseInt(heroId) === 1 ) { \n     playerSprites.src = \"./dist/sprites/heroes/hero.png\"; \n     slashingSprites.src = \"./dist/sprites/heroes/hero_attack.png\";\n   }\n\n  this.updateViewport(state);\n  this.drawBackground(state.level);\n  this.drawActors(state.actors);\n};\n\nCanvasDisplay.prototype.updateViewport = function (state) {\n  let view = this.viewport, margin = view.width / 3;\n  let player = state.player;\n  let center = player.pos.plus(player.size.times(0.5));\n\n  if (center.x < view.left + margin) {\n    view.left = Math.max(center.x - margin, 0);\n  } else if (center.x > view.left + view.width - margin) {\n    view.left = Math.min(center.x + margin - view.width,\n      state.level.width - view.width);\n  }\n\n};\n\nCanvasDisplay.prototype.drawBackground = function (level) {\n\n  let { left, top, width, height } = this.viewport;\n  let xStart = Math.floor(left);\n  let xEnd = Math.ceil(left + width);\n  let yStart = Math.floor(top);\n  let yEnd = Math.ceil(top + height);\n\n  this.cx.drawImage(background, 0, 0, 950, 550)\n\n  for (let y = yStart; y < yEnd; y++) {\n    for (let x = xStart; x < xEnd; x++) {\n      let tile = level.rows[y][x];\n      if (tile == \"empty\" || tile == \"invisibleWall\") continue;\n      let screenX = (x - left) * scale;\n      let screenY = (y - top) * scale;\n      let tileX;\n      // second # is which tile to grab from sheet \n      if (tile == \"lava\") {\n        tileX = scale\n      } else if (tile == \"lavaTop\") {\n        tileX = scale * 5\n      } else if (tile == \"trap\") {\n        tileX = scale * 1\n      } else {\n        tileX = 0\n      }\n\n      this.cx.drawImage(tiles,\n        tileX, 0, scale, scale,\n        screenX, screenY, scale, scale);\n    }\n  }\n};\n\nfunction flipHorizontally(context, around) {\n  context.translate(around, 0);\n  context.scale(-1, 1);\n  context.translate(-around, 0);\n}\n\nCanvasDisplay.prototype.drawPlayer = function (player, x, y, width, height) {\n  width += playerXOverlap * 2;\n  height += playerYOverlap\n  x -= playerXOverlap;\n\n  if (player.speed.x != 0) {\n    this.flipPlayer = player.speed.x < 0;\n  }\n\n  let tile = 8;\n  if (player.speed.y != 0) {\n    tile = 0;\n  } else if (player.speed.x != 0) {\n    tile = Math.floor(Date.now() / 60) % 11;\n  }\n\n  this.cx.save();\n  if (this.flipPlayer) {\n    flipHorizontally(this.cx, x + width / 2);\n  }\n\n  let spriteImg;\n\n  if (player.slashing) {\n    spriteImg = slashingSprites;\n  } else {\n    spriteImg = playerSprites;\n  }\n\n  let tileX = tile * width;\n\n  this.cx.drawImage(spriteImg, tileX, 0, width, height, x, y, width, height);\n  this.cx.restore();\n};\n\nCanvasDisplay.prototype.drawEnemy = function (enemy, x, y, width, height) {\n\n  width += enemyXOverlap * 2;\n  height += enemyYOverlap\n  x -= enemyXOverlap;\n  if (enemy.speed.x != 0) {\n    this.flipEnemy = enemy.speed.x < 0;\n  }\n\n  let tile = 8;\n  if (enemy.speed.y != 0) {\n    tile = 0;\n  } else if (enemy.speed.x != 0) {\n    tile = Math.floor(Date.now() / 120) % 16;\n  }\n\n  this.cx.save();\n  if (this.flipEnemy) {\n    flipHorizontally(this.cx, x + width / 2);\n  }\n  let tileX = tile * width;\n  let source; \n\n  switch (enemy.spriteImage) {\n    case 0:\n      source = minionSprites; \n      break;\n    case 1: \n      source = shamanSprites; \n      break; \n    case 2: \n      source = bigBossSprites; \n      break; \n    default:\n      source = minionSprites; \n      break;\n  }\n  \n  this.cx.drawImage(source, tileX, 0, width, height, x, y, width, height);\n  this.cx.restore();\n};\n\nCanvasDisplay.prototype.drawActors = function (actors) {\n  for (let actor of actors) {\n    let width = actor.size.x * scale;\n    let height = actor.size.y * scale;\n    let x = (actor.pos.x - this.viewport.left) * scale;\n    let y = (actor.pos.y - this.viewport.top) * scale;\n    let tileX; \n    switch (actor.type) {\n      case \"player\":\n        this.drawPlayer(actor, x, y, width, height);\n        break;\n        case \"enemy\":\n          this.drawEnemy(actor, x, y, width, height);\n          break; \n        case \"treasure\": \n          tileX = actor.spriteImage * width;\n        this.cx.drawImage(items, tileX, 0, width, height, x, y, width, height);\n        break; \n      default:\n        tileX = (actor.type == \"door\" ? scale * 2 - .5 : scale);\n        this.cx.drawImage(tiles, tileX, 0, width, height, x, y, width, height);\n        break;\n    }\n  }\n};\n\nmodule.exports = CanvasDisplay; \n\n//# sourceURL=webpack:///./src/render/canvas.js?");

/***/ }),

/***/ "./src/utils/keybindings.js":
/*!**********************************!*\
  !*** ./src/utils/keybindings.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const keys = trackKeys([\"a\", \"d\", \"w\", \"Shift\"]);\n\nfunction trackKeys(keys) {\n  let down = Object.create(null);\n  function track(event) {\n    if (event.key === \"w\") { \n      const jumpSound = document.getElementById(\"jump\"); \n      jumpSound.play();\n    }\n    if (keys.includes(event.key)) {\n      down[event.key] = event.type == \"keydown\";\n    }\n  }\n  window.addEventListener(\"keydown\", track);\n  window.addEventListener(\"keyup\", track);\n  return down;\n}\n\nmodule.exports = keys; \n\n//# sourceURL=webpack:///./src/utils/keybindings.js?");

/***/ }),

/***/ "./src/utils/util.js":
/*!***************************!*\
  !*** ./src/utils/util.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("exports.overlap = function(actor1, actor2) {\n  return (\n    actor1.pos.x + actor1.size.x > actor2.pos.x &&\n    actor1.pos.x < actor2.pos.x + actor2.size.x &&\n    actor1.pos.y + actor1.size.y > actor2.pos.y &&\n    actor1.pos.y < actor2.pos.y + actor2.size.y\n  );\n  \n}\n\n// helper method to create an element and give it attributes + child nodes\nexports.createElement = function (name, attrs, ...children) {\n  let dom = document.createElement(name);\n  for (let attr of Object.keys(attrs)) {\n    dom.setAttribute(attr, attrs[attr]);\n  }\n  for (let child of children) {\n    dom.appendChild(child);\n  }\n  return dom;\n}\n\nconst scale = 64;\n\nexports.drawGrid = function(level) {\n  return createElementHelper(\"table\", {\n    class: \"background\",\n    style: `width: ${level.width * scale}px`\n  }, ...level.rows.map(row =>\n    createElementHelper(\"tr\", { style: `height: ${scale}px` },\n      ...row.map(type => createElementHelper(\"td\", { class: type })))\n  ));\n}\n\nexports.drawActors = function(actors) {\n  return createElementHelper(\"div\", {}, ...actors.map(actor => {\n    let rect = createElementHelper(\"div\", { class: `actor ${actor.type}` });\n    rect.style.width = `${actor.size.x * scale}px`;\n    rect.style.height = `${actor.size.y * scale}px`;\n    rect.style.left = `${actor.pos.x * scale}px`;\n    rect.style.top = `${actor.pos.y * scale}px`;\n    return rect;\n  }));\n}\n\n//# sourceURL=webpack:///./src/utils/util.js?");

/***/ })

/******/ });