
const scale = 64;
const playerXOverlap = 38;
const playerYOverlap = 10;
const enemyXOverlap = 38;
const enemyYOverlap = 10;

const enemySprites = document.createElement("img");
enemySprites.src = "sprites/enemies/satyr1.png";

const playerSprites = document.createElement("img");
playerSprites.src = "sprites/heroine_sprite.png";

const slashingSprites = document.createElement("img");
slashingSprites.src = "sprites/enemies/satyr2.png";

const tiles = document.createElement("img");
tiles.src = "sprites/tiles.png";

const items = document.createElement("img"); 
items.src = "sprites/items.png";
const background = document.createElement("img");
background.src = "sprites/background.png";

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
      // second # is which tile to grab from sheet 
      if (tile == "lava") {
        tileX = scale
      } else if (tile == "lavaTop") {
        tileX = scale * 5
      } else if (tile == "trap") {
        tileX = scale * 1
      } else {
        tileX = 0
      }

      this.cx.drawImage(tiles,
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

CanvasDisplay.prototype.drawPlayer = function (player, x, y, width, height) {
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

  this.cx.drawImage(spriteImg, tileX, 0, width, height, x, y, width, height);
  this.cx.restore();
};

CanvasDisplay.prototype.drawEnemy = function (enemy, x, y, width, height) {

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
    tile = Math.floor(Date.now() / 120) % 16;
  }

  this.cx.save();
  if (this.flipEnemy) {
    flipHorizontally(this.cx, x + width / 2);
  }
  let tileX = tile * width;
  this.cx.drawImage(enemySprites, tileX, 0, width, height, x, y, width, height);
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
    } else if (actor.type == "treasure") {
      let tileX = 0 * width; 
      this.cx.drawImage(items, tileX, 0,
        width, height, x,
        y, width, height
      );
    } else {
      let tileX = (actor.type == "door" ? scale * 2 - .5 : scale);

      this.cx.drawImage(tiles,
        tileX, 0, width, height,
        x, y, width, height);
    }
  }
};

module.exports = CanvasDisplay; 