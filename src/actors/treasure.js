const Vector = require('../game/vector.js');
const State = require('../game/state.js');

class Treasure {
  constructor(pos, basePos, wobble, ch) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
    this.spriteImage = typeof ch === 'number' ? ch : this.chooseSpriteImage(ch);
  }

  get type() { return "treasure"; }

  chooseSpriteImage(ch) { 
    switch (ch) {
      case "P":
        return 0;
      case "R":
        return 1; 
      case "E": 
        return 2;
      default:
        return 0;
    }
  }

  static create(pos, ch) {
    debugger
    let basePos = pos.plus(new Vector(0.2, 0.1));
    return new Treasure(basePos, basePos, (Math.random() * Math.PI * 2), ch);
  }
}

Treasure.prototype.size = new Vector(0.45, 0.6);

Treasure.prototype.collide = function (state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "treasure")) status = "won";
  return new State(state.level, filtered, status);
};

const wobbleSpeed = 8, wobbleDist = 0.07;

Treasure.prototype.update = function (time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Treasure(
    this.basePos.plus(new Vector(0, wobblePos)),
    this.basePos, wobble, this.spriteImage
  );
};

module.exports = Treasure; 
