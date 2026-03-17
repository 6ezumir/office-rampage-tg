import { clamp, intersects } from "./utils.js";
import { renderUI } from "./ui.js";

export function createGame({ state, player, walls, entities, input }) {
  function say(text) {
    state.message = text;
    renderUI(state);
    checkLose();
  }

  function applyEffects(effects) {
    state.stats.energy = clamp(state.stats.energy + (effects.energy || 0), 0, 100);
    state.stats.stress = clamp(state.stats.stress + (effects.stress || 0), 0, 100);
    state.stats.reputation = clamp(state.stats.reputation + (effects.reputation || 0), 0, 100);
    state.stats.chaos = clamp(state.stats.chaos + (effects.chaos || 0), 0, 100);
    renderUI(state);
  }

  function completeEvent() {
    state.doneEvents += 1;
    renderUI(state);
  }

  function canMoveTo(nx, ny) {
    const next = { x: nx, y: ny, w: player.w, h: player.h };
    for (const wall of walls) {
      if (intersects(next, wall)) return false;
    }
    return true;
  }

  function updatePlayer() {
    if (!state.running) return;

    let dx = 0;
    let dy = 0;

    if (input.left) dx -= player.speed;
    if (input.right) dx += player.speed;
    if (input.up) dy -= player.speed;
    if (input.down) dy += player.speed;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    const nx = player.x + dx;
    const ny = player.y + dy;

    if (canMoveTo(nx, player.y)) player.x = nx;
    if (canMoveTo(player.x, ny)) player.y = ny;

    if (dx !== 0 || dy !== 0) {
      player.bob += 0.16;
    }
  }

  function getNearestEntity() {
    let nearest = null;
    let bestDist = Infinity;

    for (const e of entities) {
      const ex = e.x + e.w / 2;
      const ey = e.y + e.h / 2;
      const px = player.x + player.w / 2;
      const py = player.y + player.h / 2;

      const dist = Math.hypot(ex - px, ey - py);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = e;
      }
    }

    return { entity: nearest, dist: bestDist };
  }

  function finishGame() {
    state.finished = true;
    state.running = false;

    const { energy, stress, reputation, chaos } = state.stats;

    if (energy <= 15) {
      say("Ты дожил до разговора с боссом, но внутри уже давно лежишь лицом в клавиатуре.");
    } else if (stress >= 80) {
      say("Босс что-то говорил, но нервная система уже вышла из чата. Формально день закончен.");
    } else if (chaos >= 60) {
      say("Ты завершил день. Офис — нет. Но это тоже форма результата.");
    } else if (reputation >= 60) {
      say("Босс кивнул. Похоже, ты выглядишь как человек, который ещё держится. Это временно, но приятно.");
    } else {
      say("Разговор с боссом пережит. Победа скромная, но очень человеческая.");
    }
  }

  function checkLose() {
    const { energy, stress, reputation, chaos } = state.stats;
    if (state.finished) return;

    if (energy <= 0) {
      state.running = false;
      state.finished = true;
      say("Ты выгорел раньше конца дня. Организм выбрал свободу без согласования.");
    } else if (stress >= 100) {
      state.running = false;
      state.finished = true;
      say("Стресс достиг потолка. Поздравляем: теперь потолок внутри тебя.");
    } else if (reputation <= 0) {
      state.running = false;
      state.finished = true;
      say("Тебе больше не доверяют даже передвинуть стул. День формально закончен.");
    } else if (chaos >= 100) {
      state.running = false;
      state.finished = true;
      say("Офисный разгром завершён досрочно. Ты не прошёл день — ты его отменил.");
    }
  }

  function interact() {
    if (state.finished) return;

    const { entity, dist } = getNearestEntity();

    if (!entity || dist > 48) {
      say("Рядом нет ничего, с чем можно было бы драматично взаимодействовать.");
      return;
    }

    entity.interact();
    renderUI(state);
  }

  function resetGame() {
    state.running = true;
    state.finished = false;
    state.doneEvents = 0;
    state.message = "Ты пришёл в офис. Уже плохо, но пока не критично.";
    state.stats.energy = 70;
    state.stats.stress = 25;
    state.stats.reputation = 50;
    state.stats.chaos = 10;

    player.x = 50;
    player.y = 440;
    player.bob = 0;

    for (const e of entities) {
      e.used = false;
    }

    renderUI(state);
  }

  return {
    say,
    applyEffects,
    completeEvent,
    updatePlayer,
    getNearestEntity,
    interact,
    finishGame,
    resetGame,
    getState: () => state
  };
}