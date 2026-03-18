export function createWakeUpGame(onFinish) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    parent: "phaserSleepGame",
    transparent: false,
    backgroundColor: "#050814",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
      create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.cameras.main.setBackgroundColor("#050814");

        this.add.rectangle(w / 2, h / 2, w, h, 0x050814);

        const moonGlow = this.add.ellipse(w - 60, 120, 160, 220, 0x8fb0ff, 0.08);
        moonGlow.setAngle(-18);

        const moonGlow2 = this.add.ellipse(w - 80, 160, 120, 280, 0x5b8cff, 0.05);
        moonGlow2.setAngle(-18);

        this.add.rectangle(w / 2, h - 40, w, 120, 0x0a1020);

        this.add.ellipse(w / 2, h - 165, 250, 50, 0x000000, 0.25);

        const bedBase = this.add.rectangle(w / 2, h - 210, 250, 135, 0x17233a, 1);
        bedBase.setStrokeStyle(2, 0x26314e);

        this.add.rectangle(w / 2, h - 212, 226, 110, 0x22314d, 1);

        this.add.rectangle(w / 2 - 62, h - 248, 74, 30, 0xd6e0f6, 1)
          .setStrokeStyle(1, 0xb7c5e5);

        this.add.circle(w / 2 - 78, h - 230, 20, 0x0b1223, 1);
        this.add.ellipse(w / 2 - 82, h - 237, 26, 16, 0x050814, 0.55);

        const body = this.add.ellipse(w / 2 + 5, h - 205, 128, 42, 0x0f182c, 1);

        const blanket = this.add.rectangle(w / 2 + 6, h - 185, 206, 70, 0x31486f, 1);
        blanket.setStrokeStyle(1, 0x46679f);

        const blanketTop = this.add.rectangle(w / 2 + 3, h - 211, 190, 14, 0x496a9f, 0.55);

        this.add.rectangle(w - 56, h - 214, 60, 28, 0x1a2440, 1)
          .setStrokeStyle(1, 0x2e3b5f);

        const alarmGlow = this.add.circle(w - 56, h - 246, 34, 0xff5f76, 0.16);
        const alarm = this.add.rectangle(w - 56, h - 246, 34, 34, 0xff5f76, 1);
        alarm.setStrokeStyle(2, 0xff90a0);

        this.add.rectangle(w - 65, h - 225, 5, 6, 0xaeb9d8, 1);
        this.add.rectangle(w - 47, h - 225, 5, 6, 0xaeb9d8, 1);

        const timeText = this.add.text(w / 2, 86, "07:00", {
          fontFamily: "Arial, sans-serif",
          fontSize: "42px",
          color: "#edf2ff",
          fontStyle: "700"
        }).setOrigin(0.5);

        this.add.text(w / 2, 124, "Понедельник", {
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          color: "#95a2c8"
        }).setOrigin(0.5);

        const hintBg = this.add.rectangle(w / 2, h - 58, 240, 42, 0x1b2440, 0.92);
        hintBg.setStrokeStyle(1, 0x30405f);

        const hintText = this.add.text(w / 2, h - 58, "Тапни, чтобы выключить будильник", {
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#edf2ff"
        }).setOrigin(0.5);

        this.tweens.add({
          targets: [body, blanket, blanketTop],
          scaleY: 1.045,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });

        this.tweens.add({
          targets: alarm,
          angle: { from: -8, to: 8 },
          duration: 80,
          yoyo: true,
          repeat: -1
        });

        this.tweens.add({
          targets: alarmGlow,
          scale: 1.22,
          alpha: 0.28,
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });

        this.tweens.add({
          targets: timeText,
          alpha: 0.72,
          duration: 650,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });

        this.tweens.add({
          targets: [hintBg, hintText],
          y: "-=3",
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });

        const fadeOverlay = this.add.rectangle(w / 2, h / 2, w, h, 0x050814, 0);
        fadeOverlay.setDepth(100);

        this.input.once("pointerdown", () => {
          this.tweens.add({
            targets: fadeOverlay,
            alpha: 1,
            duration: 320,
            ease: "Power2",
            onComplete: () => {
              onFinish();
            }
          });
        });
      }
    }
  });
}