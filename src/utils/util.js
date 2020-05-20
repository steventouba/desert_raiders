exports.overlap = function(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y;
}

// helper method to create an element and give it attributes + child nodes
exports.createElement = function (name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}

const scale = 64;

exports.drawGrid = function(level) {
  return createElementHelper("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    createElementHelper("tr", { style: `height: ${scale}px` },
      ...row.map(type => createElementHelper("td", { class: type })))
  ));
}

exports.drawActors = function(actors) {
  return createElementHelper("div", {}, ...actors.map(actor => {
    let rect = createElementHelper("div", { class: `actor ${actor.type}` });
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}