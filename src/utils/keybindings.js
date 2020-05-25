const keys = trackKeys(["a", "d", "w", "Shift"]);

function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (event.key === "w") { 
      document.getElementById("jump").play(); 
    } else if (event.key === "Shift") { 
      document.getElementById("attack").play();
    }
    
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

module.exports = keys; 