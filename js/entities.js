export function createEntities(api) {
  return [
    {
      id: "printer",
      type: "item",
      x: 270,
      y: 150,
      w: 34,
      h: 34,
      color: "#d8dde9",
      label: "Принтер",
      used: false,
      interact() {
        if (this.used) {
          api.say("Принтер уже пережил твоё внимание. Повторно страдать он не хочет.");
          return;
        }
        this.used = true;
        api.applyEffects({ stress: -8, chaos: 14, reputation: -5 });
        api.completeEvent();
        api.say("Ты ударил принтер, и он внезапно заработал. Непедагогично, зато эффективно.");
      }
    },
    {
      id: "coffee",
      type: "item",
      x: 62,
      y: 150,
      w: 34,
      h: 34,
      color: "#8b5a3c",
      label: "Кофемашина",
      used: false,
      interact() {
        if (this.used) {
          api.say("Ты уже выжал из этой кофемашины всё, кроме уважения.");
          return;
        }
        this.used = true;
        api.applyEffects({ energy: 18, stress: -4, chaos: 2 });
        api.completeEvent();
        api.say("Ты влил в себя кофе сомнительного происхождения. Сердце против, дух за.");
      }
    },
    {
      id: "colleague",
      type: "npc",
      x: 88,
      y: 285,
      w: 26,
      h: 26,
      color: "#f7c66b",
      label: "Коллега",
      used: false,
      interact() {
        if (this.used) {
          api.say("Коллега уже выговорился и теперь занят имитацией продуктивности.");
          return;
        }
        this.used = true;
        api.applyEffects({ stress: 6, reputation: 8 });
        api.completeEvent();
        api.say("Коллега вывалил на тебя полжизни и один рабочий вопрос. Ты стал ближе к людям, но дальше от покоя.");
      }
    },
    {
      id: "boss",
      type: "npc",
      x: 262,
      y: 324,
      w: 28,
      h: 28,
      color: "#ff728a",
      label: "Босс",
      used: false,
      interact() {
        if (api.getState().doneEvents < 3) {
          api.say("Босс смотрит так, будто ты подошёл слишком рано. Сначала разберись с офисным хаосом.");
          return;
        }
        if (this.used) {
          api.say("Разговор уже состоялся. Осадок тоже.");
          return;
        }
        this.used = true;
        api.finishGame();
      }
    }
  ];
}