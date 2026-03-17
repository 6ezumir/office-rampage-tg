export function createInput() {
  return {
    up: false,
    down: false,
    left: false,
    right: false
  };
}

export function bindKeyboard(input, onInteract) {
  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (key === "arrowup" || key === "w") input.up = true;
    if (key === "arrowdown" || key === "s") input.down = true;
    if (key === "arrowleft" || key === "a") input.left = true;
    if (key === "arrowright" || key === "d") input.right = true;

    if (key === "e" || key === " ") {
      e.preventDefault();
      onInteract();
    }
  });

  window.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();

    if (key === "arrowup" || key === "w") input.up = false;
    if (key === "arrowdown" || key === "s") input.down = false;
    if (key === "arrowleft" || key === "a") input.left = false;
    if (key === "arrowright" || key === "d") input.right = false;
  });
}

export function bindTouchControls(input) {
  document.querySelectorAll("[data-dir]").forEach((btn) => {
    const dir = btn.dataset.dir;

    const start = (ev) => {
      ev.preventDefault();
      input[dir] = true;
    };

    const end = (ev) => {
      ev.preventDefault();
      input[dir] = false;
    };

    btn.addEventListener("touchstart", start, { passive: false });
    btn.addEventListener("touchend", end, { passive: false });
    btn.addEventListener("touchcancel", end, { passive: false });

    btn.addEventListener("mousedown", start);
    btn.addEventListener("mouseup", end);
    btn.addEventListener("mouseleave", end);
  });
}