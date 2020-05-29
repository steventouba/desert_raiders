const keys = trackKeys(["a", "d", "w", "ArrowLeft", "ArrowRight", "ArrowUp", "Shift"]);

function trackKeys(keys) {
  debugger
  let down = Object.create(null);
  function track(event) {
    if (event.key === "w" || event.key === "ArrowUp") { 
      document.getElementById("jump").play(); 
    } else if (event.key === "Shift") { 
      document.getElementById("attack").play();
    }
    
    if (keys.includes(event.key)) {
      event.preventDefault();
      down[event.key] = event.type == "keydown";
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

module.exports = keys; 