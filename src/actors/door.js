const Vector = require('../game/vector.js');
const State = require('../game/state.js');

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

Door.prototype.collide = function (state) {
  return new State(state.level, state.actors, "won");
};

Door.prototype.update = function (time) {
  return new Door(this.pos)
}

module.exports = Door; 
