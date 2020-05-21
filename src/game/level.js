const Player = require('../actors/player.js')
const Enemy = require('../actors/enemy.js')
const Door = require('../actors/door.js')
const Treasure = require('../actors/treasure.js')
const Vector = require('./vector.js');

const levelChars = {
  ".": "empty",
  "#": "wall",
  "|": "invisibleWall",
  "+": "lava",
  "~": "lavaTop",
  "t": "trap",
  "D": Door,
  "M": Enemy,
  "S": Enemy,
  "B": Enemy,
  "@": Player,
  "P": Treasure,
  "R": Treasure,
  "E": Treasure,
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

module.exports = Level; 