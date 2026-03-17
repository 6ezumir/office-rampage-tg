import { COLORS } from "./config.js";

export function createRenderer(canvas, player, entities, walls, getNearestEntity, state) {
  const ctx = canvas.getContext("2d");

  function drawRoom() {
    ctx.fillStyle = COLORS.roomBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLORS.floorTile;
    for (let y = 24; y < canvas.height - 24; y += 32) {
      for (let x = 24; x < canvas.width - 24; x += 32) {
        ctx.fillRect(x + 2, y + 2, 28, 28);
      }
    }

    for (const wall of walls) {
      ctx.fillStyle =
        wall.y === 0 || wall.x === 0 || wall.x === 336 || wall.y === 516
          ? COLORS.borderWall
          : COLORS.innerWall;
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    }

    ctx.fillStyle = COLORS.desk;
    ctx.fillRect(250, 300, 62, 42);
    ctx.fillStyle = COLORS.deskTop;
    ctx.fillRect(252, 302, 58, 38);
  }

  function drawEntity(e) {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.w, e.h);

    ctx.fillStyle = "#0a1020";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(e.label, e.x + e.w / 2, e.y - 6);

    if (!e.used) {
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.strokeRect(e.x - 2, e.y - 2, e.w + 4, e.h + 4);
    }
  }

  function drawPlayer() {
    const bobOffset = Math.sin(player.bob) * 1.2;

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y + bobOffset, player.w, player.h);

    ctx.fillStyle = "#dbe7ff";
    ctx.fillRect(player.x + 5, player.y + 5 + bobOffset, 5, 5);
    ctx.fillRect(player.x + 14, player.y + 5 + bobOffset, 5, 5);
  }

  function drawPrompt() {
    if (state.finished) return;

    const { entity, dist } = getNearestEntity();
    if (!entity || dist > 48) return;

    const text = "E / Взаимодействовать";
    ctx.font = "12px sans-serif";
    const width = ctx.measureText(text).width + 20;
    const x = canvas.width / 2 - width / 2;
    const y = canvas.height - 44;

    ctx.fillStyle = "rgba(10,16,32,0.85)";
    ctx.fillRect(x, y, width, 28);
    ctx.strokeStyle = "rgba(91,140,255,0.65)";
    ctx.strokeRect(x, y, width, 28);

    ctx.fillStyle = "#eef2ff";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, y + 18);
  }

  function render() {
    drawRoom();
    for (const e of entities) drawEntity(e);
    drawPlayer();
    drawPrompt();
  }

  return { render };
}