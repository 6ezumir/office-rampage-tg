import { GAME_CONFIG } from "./config.js";

export function createGameState() {
  return {
    running: true,
    finished: false,
    currentDay: 1,
    dayLabel: "Понедельник",
    message: GAME_CONFIG.initialMessage,
    stats: { ...GAME_CONFIG.initialStats },
    doneEvents: 0
  };
}