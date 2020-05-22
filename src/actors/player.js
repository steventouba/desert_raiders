const Vector = require('../game/vector.js');
const State = require('../game/state.js');

class Player {

  constructor(pos, speed, slashing) {
    this.pos = pos;
    this.speed = speed;
    this.slashing = slashing;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vector(0, -0.6)), new Vector(0, 0));
  }

}

Player.prototype.size = new Vector(0.8, 1.6) // this in tandem with the static create offsets the player character the appropriate distance so it sits on top of the block below

const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 13.5;
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

module.exports = Player; 
