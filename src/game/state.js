const Util = require('../utils/util.js')

class State {

  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
    if (this.status === 'lost') score = 0; 
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
}

State.prototype.update = function (time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) {
    return new State(this.level, actors, "lost");
  }

  if (this.level.touches(player.pos, player.size, "lavaTop")) {
    return new State(this.level, actors, "lost");
  }

  if (this.level.touches(player.pos, player.size, "trap")) {
    return new State(this.level, actors, "lost");
  }

  for (let actor of actors) {
    if (actor != player && Util.overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};

module.exports = State; 
