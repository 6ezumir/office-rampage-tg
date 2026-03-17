import { createGameState } from "./state.js";
import { createPlayer, createWalls } from "./world.js";
import { createInput, bindKeyboard, bindTouchControls } from "./input.js";
import { createEntities } from "./entities.js";
import { createGame } from "./game.js";
import { createRenderer } from "./render.js";
import { renderUI } from "./ui.js";

const canvas = document.getElementById("game");

const state = createGameState();
const player = createPlayer();
const walls = createWalls();
const input = createInput();

let game;

const api = {
  say: (...args) => game.say(...args),
  applyEffects: (...args) => game.applyEffects(...args),
  completeEvent: (...args) => game.completeEvent(...args),
  finishGame: (...args) => game.finishGame(...args),
  getState: () => game.getState()
};

const entities = createEntities(api);

game = createGame({
  state,
  player,
  walls,
  entities,
  input
});

const renderer = createRenderer(
  canvas,
  player,
  entities,
  walls,
  () => game.getNearestEntity(),
  state
);

bindKeyboard(input, () => game.interact());
bindTouchControls(input);

const interactBtn = document.getElementById("interactBtn");
const restartBtn = document.getElementById("restartBtn");

if (interactBtn) {
  interactBtn.addEventListener("click", () => game.interact());
}

if (restartBtn) {
  restartBtn.addEventListener("click", () => game.resetGame());
}

renderUI(state);

// ===== MENU =====
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const startGameBtn = document.getElementById("startGameBtn");
const howToPlayBtn = document.getElementById("howToPlayBtn");

function openGame() {
  if (menuScreen) {
    menuScreen.classList.remove("active");
  }

  if (gameScreen) {
    gameScreen.classList.add("active");
  }
}

function showHowToPlay() {
  alert(
    "Цель: пережить офисный день.\n\n" +
    "Передвигайся стрелками или WASD.\n" +
    "Подходи к объектам и людям.\n" +
    "Нажимай E, пробел или кнопку «Взаимодействовать».\n\n" +
    "Следи за энергией, стрессом, репутацией и хаосом."
  );
}

if (startGameBtn) {
  startGameBtn.addEventListener("click", openGame);
}

if (howToPlayBtn) {
  howToPlayBtn.addEventListener("click", showHowToPlay);
}

function loop() {
  game.updatePlayer();
  renderer.render();
  requestAnimationFrame(loop);
}

loop();