import { clamp } from "./utils.js";

const refs = {
  message: document.getElementById("message"),
  goalText: document.getElementById("goalText"),
  doneEvents: document.getElementById("doneEvents"),
  dayText: document.getElementById("dayText"),

  energyValue: document.getElementById("energyValue"),
  stressValue: document.getElementById("stressValue"),
  repValue: document.getElementById("repValue"),
  chaosValue: document.getElementById("chaosValue"),

  energyBar: document.getElementById("energyBar"),
  stressBar: document.getElementById("stressBar"),
  repBar: document.getElementById("repBar"),
  chaosBar: document.getElementById("chaosBar")
};

function setBar(el, value, inverse = false) {
  const v = clamp(value, 0, 100);
  el.style.width = `${v}%`;

  const score = inverse ? 100 - v : v;
  el.className = "fill " + (score >= 67 ? "good" : score >= 34 ? "warn" : "bad");
}

export function renderUI(state) {
  refs.energyValue.textContent = state.stats.energy;
  refs.stressValue.textContent = state.stats.stress;
  refs.repValue.textContent = state.stats.reputation;
  refs.chaosValue.textContent = state.stats.chaos;
  refs.doneEvents.textContent = state.doneEvents;
  refs.dayText.textContent = state.dayLabel;

  setBar(refs.energyBar, state.stats.energy);
  setBar(refs.stressBar, state.stats.stress, true);
  setBar(refs.repBar, state.stats.reputation);
  setBar(refs.chaosBar, state.stats.chaos, true);

  refs.message.textContent = state.message;
  refs.goalText.textContent = state.finished ? "День завершён" : "Поговорить с боссом";
}