const Vector = require('../game/vector.js');
const State = require('../game/state.js');

class Enemy {
  constructor(pos, speed, ch) {
    debugger
    this.pos = pos;
    this.speed = speed;
    this.spriteImage = typeof ch === 'number' ? ch : this.chooseSpriteImage(ch);
  }

  get type() { return "enemy"; }

  chooseSpriteImage(ch) {
    switch (ch) {
      case "M":
        return 0;
      case "S":
        return 1;
      case "B":
        return 2;
      default:
        return 0;
    }
  }

  static create(pos, ch) {
    return new Enemy(pos.plus(new Vector(0, -0.6)), new Vector(2, 0), ch)
  }
}

Enemy.prototype.size = new Vector(1.25, 1.6);

Enemy.prototype.update = function (time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "invisibleWall")) {
    return new Enemy(newPos, this.speed, this.spriteImage);
  } else {
    return new Enemy(this.pos, this.speed.times(-1), this.spriteImage);
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

module.exports = Enemy; 
