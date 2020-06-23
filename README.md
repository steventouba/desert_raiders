# Desert Raiders

[Live Link](https://steventouba.github.io/desert_raiders/)

## Background
Desert Raiders is a classical 2-D platformer inspired by games such as Super Mario Bros and Prince of Persia. 

In a throwback to the 80's, you control one of two heroes as you run, jump and slice your way through the game. The goal, collect as much treasure as you can. 

## Technologies
This project was implemented with the following technologies:

JavaScript for game logic  
Canvas for effects and animations

## Game Logic and Functionality 

**Movement**  
  Users can move and attack using an combination of the following keys: "W", "A", "D", "LeftArrow", "RightArrow", "UpArrow", "SHIFT", "SPACE".   
  ![image](./images/movement.gif)
  
  The following function is used to track key presses and respond to user input. 
  ```javascript 
  const keys = trackKeys(["a", "d", "w",
  "ArrowLeft", "ArrowRight", "ArrowUp",
  "Shift", " "]);

function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (event.key === "w" || event.key === "ArrowUp") { 
      document.getElementById("jump").play(); 
    } else if (event.key === "Shift" || event.key === " ") { 
      document.getElementById("attack").play();
    }
    
    if (keys.includes(event.key)) {
      event.preventDefault();
      down[event.key] = event.type === "keydown";
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);

  return down;
}
```

**Backgrounds and Enemies**   
  Depending on the level and user location within a level, different backgrounds
  and enemies are drawn to the canvas.   
  ![image](./images/backgrounds.gif)

All enemies belong to a single class. Enemy sprite images are render based upon a spriteImage attribute assigned upon instantiation.    
```javascript 
class Enemy {
  constructor(pos, speed, ch) {
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
  let source; 

  switch (enemy.spriteImage) {
    case 0:
      source = minionSprites; 
      break;
    case 1: 
      source = shamanSprites; 
      break; 
    case 2: 
      source = bigBossSprites; 
      break; 
    default:
      source = minionSprites; 
      break;
  }
  
  this.cx.drawImage(source, tileX, 0, width, height, x, y, width, height);
  this.cx.restore();
};
```
