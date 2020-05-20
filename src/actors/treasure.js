const Vector = require('../game/vector.js');
const State = require('../game/state.js');

class Treasure {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "treasure"; }

  static create(pos) {
    let basePos = pos.plus(new Vector(0.2, 0.1));
    return new Treasure(basePos, basePos, Math.random() * Math.PI * 2);
  }
}

Treasure.prototype.size = new Vector(0.6, 0.6);

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
  return new Treasure(this.basePos.plus(new Vec(0, wobblePos)),
    this.basePos, wobble);
};

module.exports = Treasure; 
