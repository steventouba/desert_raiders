class Vector {

  constructor(x, y) {
    this.x = x; this.y = y;
  }

  plus(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  times(factor) {
    return new Vector(this.x * factor, this.y * factor);
  }

}

class Player {

  constructor(pos, speed, slashing) {
    this.pos = pos;
    this.speed = speed;
    this.slashing = slashing;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vector(0, -0.6)),
      new Vector(0, 0));
  }

}

Player.prototype.size = new Vector(0.8, 1.6) // this in tandem with the static create offsets the player character the appropriate distance so it sits on top of the block below

class Door {

  constructor(pos) {
    this.pos = pos;
  }

  get type() { return "door"; }

  static create(pos) {
    return new Door(pos.plus(new Vector(-0.1, -0.2)),
      new Vector(0, 0));
  }

}

Door.prototype.size = new Vector(1, 1.2)

class Enemy {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() { return "enemy"; }

  static create(pos) {
    return new Enemy(pos.plus(new Vector(0, -0.6)),
      new Vector(2, 0))
  }
}

Enemy.prototype.size = new Vector(0.8, 1.6);

Enemy.prototype.update = function (time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "invisibleWall")) {
    return new Enemy(newPos, this.speed, this.reset);
  } else {
    return new Enemy(this.pos, this.speed.times(-1));
  }
};

Enemy.prototype.collide = function (state) {
  let filtered = state.actors.filter(a => a != this);
  let player = state.actors.filter(a => a.type == "player").shift();
  let status = state.status;
  if (player.slashing) {
    return new State(state.level, filtered, status);
  } else {
    return new State(state.level, state.actors, "lost");
  }
}

const levelChars = {
  ".": "empty",
  "#": "wall",
  "|": "invisibleWall",
  "+": "lava",
  "~": "lavaTop",
  "T": "trap",
  "d": Door,
  "e": Enemy,
  "@": Player
};

class Level {

  constructor(plan) {
    let rows = plan.trim().split("/").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type === "string") return type;

        if (type == Door) {
          this.startActors.unshift(
            type.create(new Vector(x, y), ch)
          );
        } else {
          this.startActors.push(
            type.create(new Vector(x, y), ch));
        }
        return "empty";
      });
    });
  }
}

class State {

  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
}

// helper method to create an element and give it attributes + child nodes

function createElementHelper(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}

const scale = 64;

function drawGrid(level) {
  debugger
  return createElementHelper("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    createElementHelper("tr", { style: `height: ${scale}px` },
      ...row.map(type => createElementHelper("td", { class: type })))
  ));
}

function drawActors(actors) {
  return createElementHelper("div", {}, ...actors.map(actor => {
    let rect = createElementHelper("div", { class: `actor ${actor.type}` });
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}

Level.prototype.touches = function (pos, size, type) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
        y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (here == type) return true;
    }
  }
  return false;
};

State.prototype.update = function (time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) {
    console.log('lost')
    return new State(this.level, actors, "lost");
  }

  if (this.level.touches(player.pos, player.size, "lavaTop")) {
     console.log('lost')
    return new State(this.level, actors, "lost");
  }

  if (this.level.touches(player.pos, player.size, "trap")) {
    return new State(this.level, actors, "lost");
  }

  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};

Door.prototype.collide = function (state) {
  return new State(state.level, state.actors, "won");
};

function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y;
}

const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 11.5;
const enemyXSpeed = 7;

Player.prototype.update = function (time, state, keys) {
  let xSpeed = 0;
  let slashing = false;
  if (keys.a) xSpeed -= playerXSpeed;
  if (keys.d) xSpeed += playerXSpeed;
  if (keys.Shift) slashing = true;
  let pos = this.pos;
  let movedX = pos.plus(new Vector(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }
  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vector(0, ySpeed * time));

  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.w && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vector(xSpeed, ySpeed), slashing);
};

Door.prototype.update = function (time) {
  return new Door(this.pos)
}

function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const keys =
  trackKeys(["a", "d", "w", "Shift"]);

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

async function runGame(plans, Display) {
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]),
      Display);
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

class CanvasDisplay {
  constructor() {
    this.canvas = document.createElement("canvas");
    let parent = document.getElementById("canvas-container");
    parent.appendChild(this.canvas);
    this.canvas.width = 950;
    this.canvas.height = 550;
    this.cx = this.canvas.getContext("2d");
    this.flipPlayer = false;
    this.flipEnemy = false;
    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / scale,
      height: this.canvas.height / scale
    };
  }

  clear() {
    this.canvas.remove();
  }
}

CanvasDisplay.prototype.syncState = function (state) {
  this.updateViewport(state);
  this.drawBackground(state.level);
  this.drawActors(state.actors);
};

CanvasDisplay.prototype.updateViewport = function (state) {
  let view = this.viewport, margin = view.width / 3;
  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5));

  if (center.x < view.left + margin) {
    view.left = Math.max(center.x - margin, 0);
  } else if (center.x > view.left + view.width - margin) {
    view.left = Math.min(center.x + margin - view.width,
      state.level.width - view.width);
  }

};

let otherSprites = document.createElement("img");
otherSprites.src = "sprites/background_spritesheet.png";

let background = document.createElement("img");
background.src = "sprites/background_spritesheet.png";

CanvasDisplay.prototype.drawBackground = function (level) {
  let { left, top, width, height } = this.viewport;
  let xStart = Math.floor(left);
  let xEnd = Math.ceil(left + width);
  let yStart = Math.floor(top);
  let yEnd = Math.ceil(top + height);

  this.cx.drawImage(background, 0, 0, 950, 550)

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let tile = level.rows[y][x];
      if (tile == "empty" || tile == "invisibleWall") continue;
      let screenX = (x - left) * scale;
      let screenY = (y - top) * scale;
      let tileX;

      if (tile == "lava") {
        tileX = scale
      } else if (tile == "lavaTop") {
        tileX = scale * 3
      } else if (tile == "trap") {
        tileX = scale * 4
      } else {
        tileX = 0
      }

      this.cx.drawImage(otherSprites,
        tileX, 0, scale, scale,
        screenX, screenY, scale, scale);
    }
  }
};

function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}

let playerSprites = document.createElement("img");
playerSprites.src = "sprites/heroine_sprite.png";

let slashingSprites = document.createElement("img");
slashingSprites.src = "sprites/enemy_spritesheet.png";

const playerXOverlap = 38;
const playerYOverlap = 10;

CanvasDisplay.prototype.drawPlayer = function (player, x, y, width, height) {
  debugger
  width += playerXOverlap * 2;
  height += playerYOverlap
  x -= playerXOverlap;
  if (player.speed.x != 0) {
    this.flipPlayer = player.speed.x < 0;
  }

  let tile = 8;
  if (player.speed.y != 0) {
    tile = 0;
  } else if (player.speed.x != 0) {
    tile = Math.floor(Date.now() / 60) % 11;
  }

  this.cx.save();
  if (this.flipPlayer) {
    flipHorizontally(this.cx, x + width / 2);
  }

  let spriteImg;

  if (player.slashing) {
    spriteImg = slashingSprites;
  } else {
    spriteImg = playerSprites;
  }

  let tileX = tile * width;

  this.cx.drawImage(spriteImg, tileX, 0, width, height,x, y, width, height);
  this.cx.restore();
};

let enemySprites = document.createElement("img");
enemySprites.src = "sprites/enemy_spritesheet.png";
const enemyXOverlap = 38;
const enemyYOverlap = 10;

CanvasDisplay.prototype.drawEnemy = function (enemy, x, y, width, height) {
  debugger
  width += enemyXOverlap * 2;
  height += enemyYOverlap
  x -= enemyXOverlap;
  if (enemy.speed.x != 0) {
    this.flipEnemy = enemy.speed.x < 0;
  }

  let tile = 8;
  if (enemy.speed.y != 0) {
    tile = 0;
  } else if (enemy.speed.x != 0) {
    tile = Math.floor(Date.now() / 60) % 11;
  }

  this.cx.save();
  if (this.flipEnemy) {
    flipHorizontally(this.cx, x + width / 2);
  }
  let tileX = tile * width;
  this.cx.drawImage(enemySprites, tileX, 0, width, height,
    x, y, width, height);
  this.cx.restore();
};

CanvasDisplay.prototype.drawActors = function (actors) {
  for (let actor of actors) {
    let width = actor.size.x * scale;
    let height = actor.size.y * scale;
    let x = (actor.pos.x - this.viewport.left) * scale;
    let y = (actor.pos.y - this.viewport.top) * scale;
    if (actor.type == "player") {
      this.drawPlayer(actor, x, y, width, height);
    } else if (actor.type == "enemy") {
      this.drawEnemy(actor, x, y, width, height);
    } else {
      let tileX = (actor.type == "door" ? scale * 2 - .5 : scale);

      this.cx.drawImage(otherSprites,
        tileX, 0, width, height,
        x, y, width, height);
    }
  }
};

function playGame() {
  runGame(GAME_LEVELS, CanvasDisplay);
}

document.addEventListener("DOMContentLoaded", function () {

  runGame(GAME_LEVELS, CanvasDisplay)
  // document.getElementById("play-button").addEventListener("click", function () {
  //   let button = document.getElementById("play-button");
  //   const canvas = document.querySelector("canvas");
  //   canvas.remove();
  //   button.remove();
  //   playGame();
  // })

});

let GAME_LEVELS = [
  `........................../........................../.............|...e|......d/..............####......##/..........##...##......###/@.........##~~~##~~~~#####/###~~~~~####+++##++++#####/###+++++####+++##++++#####/##########################`,
  `#########................./#########d|.e........|..../######################..##/.......................###/.......................###/@........####.........####/##T####~~####~~####~~#####/#######++####++####++#####/##########################`,
  `........................../.|.................e..|.../..####################..../....................##..../#|.e..............|.##..../##################..##...d/....................##~~##/@..................###++##/####T######T##########++##`,
  `........................../@........|e............|../###......###############../.........#................/.........#................/..########...####........./............####........../|e........|.##......|e..|d/T#########T###~~~~~~######`,
  `........................../d........................./#####|.e..|...##########../....######~~~##.........../.........#####...........#/......................####/....................#T####/@....|.e......e.|#T#######/###TT#####################`,
  `........................../........................../........................../...d.....#..#............./...###..##.....#T#......../.....................#..../...........#.........##.../@...##.....#.....##......./##~~##~#~~##~~~#~~~~~~~~~~`,
  `........................../@.|..e..|................./#T#########.|.e....|....../............T######......./d........#.............#T#/#........#................/|.e.|...................../####.........T#####......./##~~~~####~~~~~~~~~~~~~~~~`
];
