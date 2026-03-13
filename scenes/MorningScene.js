// ==================== УТРЕННЯЯ СЦЕНА ====================

class MorningScene extends Phaser.Scene {
    constructor() {
        super('MorningScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Масштабируем всё под экран
        const scale = Math.min(width / 800, height / 600);
        const baseSize = Math.floor(16 * scale);
        
        // 1. ФОН СПАЛЬНИ
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a3a, 0x1a1a3a, 0x2a2a4a, 0x2a2a4a, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // 2. КРОВАТЬ (адаптивная)
        const bedWidth = Math.floor(300 * scale);
        const bedHeight = Math.floor(80 * scale);
        const mattressWidth = Math.floor(280 * scale);
        const mattressHeight = Math.floor(40 * scale);
        
        // Основание кровати
        this.add.rectangle(centerX, height - 100 * scale, bedWidth, bedHeight, 0x8B4513).setOrigin(0.5);
        
        // Матрас
        this.add.rectangle(centerX, height - 130 * scale, mattressWidth, mattressHeight, 0x5D3A1A).setOrigin(0.5);
        
        // Подушка
        this.add.ellipse(centerX - 50 * scale, height - 140 * scale, 
                        60 * scale, 30 * scale, 0xfff5e6);
        
        // Одеяло
        this.add.rectangle(centerX, height - 115 * scale, mattressWidth, 20 * scale, 0x3498db, 0.3).setOrigin(0.5);
        
        // 3. ТУМБОЧКА
        const nightstandX = centerX + 120 * scale;
        const nightstandY = height - 120 * scale;
        this.add.rectangle(nightstandX, nightstandY, 60 * scale, 50 * scale, 0x8B4513).setOrigin(0.5);
        
        // 4. БУДИЛЬНИК (адаптивный)
        const alarmX = nightstandX;
        const alarmY = nightstandY - 20 * scale;
        
        // Корпус будильника
        this.add.rectangle(alarmX, alarmY, 40 * scale, 50 * scale, 0xff3366).setOrigin(0.5);
        
        // Циферблат
        this.add.circle(alarmX, alarmY - 5 * scale, 15 * scale, 0xffffff);
        
        // Стрелки
        this.add.line(alarmX, alarmY - 5 * scale, 0, 0, 0, -10 * scale, 0x000000).setOrigin(0, 0.5);
        this.add.line(alarmX, alarmY - 5 * scale, 0, 0, 0, -8 * scale, 0x000000).setOrigin(0, 0.5);
        
        // Кнопка будильника
        const alarmButton = this.add.circle(alarmX, alarmY - 30 * scale, 5 * scale, 0xff0000);
        
        // 5. ТЕЛЕФОН (адаптивный)
        const phoneX = centerX - 100 * scale;
        const phoneY = nightstandY;
        this.add.rectangle(phoneX, phoneY, 30 * scale, 50 * scale, 0x333333).setOrigin(0.5);
        this.add.rectangle(phoneX, phoneY - 10 * scale, 20 * scale, 30 * scale, 0x87CEEB).setOrigin(0.5);
        
        // Время на телефоне
        const timeText = this.add.text(phoneX, phoneY - 15 * scale, '7:45', {
            fontSize: Math.floor(10 * scale) + 'px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 6. ОКНО (адаптивное)
        const windowX = 100 * scale;
        const windowY = 150 * scale;
        this.add.rectangle(windowX, windowY, 80 * scale, 100 * scale, 0x87CEEB, 0.3).setOrigin(0.5);
        this.add.rectangle(windowX, windowY, 76 * scale, 96 * scale, 0x000000, 0.5).setOrigin(0.5);
        
        // 7. ТЕКСТ "УТРО"
        this.add.text(centerX, 50 * scale, '🌅 УТРО', {
            fontSize: Math.floor(32 * scale) + 'px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#ff3366',
            strokeThickness: Math.floor(4 * scale)
        }).setOrigin(0.5);
        
        // 8. СЧЕТЧИК БУДИЛЬНИКА
        let snoozeCount = 0;
        const maxSnooze = 3;
        
        const snoozeText = this.add.text(centerX, 100 * scale, `Переносов: ${snoozeCount}/${maxSnooze}`, {
            fontSize: Math.floor(16 * scale) + 'px',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        // 9. КНОПКИ (адаптивные)
        const buttonWidth = Math.floor(200 * scale);
        const buttonHeight = Math.floor(50 * scale);
        const buttonY = height - 50 * scale;
        
        // Кнопка "Еще 5 минут"
        const snoozeBtn = this.add.rectangle(centerX - buttonWidth * 0.75, buttonY, 
                                            buttonWidth, buttonHeight, 0xff3366)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(Math.floor(2 * scale), 0xffffff);
        
        this.add.text(centerX - buttonWidth * 0.75, buttonY, '😴 ЕЩЕ 5 МИНУТ', {
            fontSize: Math.floor(16 * scale) + 'px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Кнопка "Встать"
        const wakeBtn = this.add.rectangle(centerX + buttonWidth * 0.75, buttonY, 
                                          buttonWidth * 0.75, buttonHeight, 0x33ccff)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(Math.floor(2 * scale), 0xffffff);
        
        this.add.text(centerX + buttonWidth * 0.75, buttonY, '⏰ ВСТАТЬ', {
            fontSize: Math.floor(18 * scale) + 'px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Кнопка "Больничный"
        const sickBtn = this.add.rectangle(centerX, buttonY - 70 * scale, 
                                          buttonWidth, buttonHeight * 0.8, 0x2ecc71)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(Math.floor(2 * scale), 0xffffff)
            .setVisible(false);
        
        const sickText = this.add.text(centerX, buttonY - 70 * scale, '🤒 ВЗЯТЬ БОЛЬНИЧНЫЙ', {
            fontSize: Math.floor(14 * scale) + 'px',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false);
        
        // 10. АНИМАЦИЯ БУДИЛЬНИКА
        this.tweens.add({
            targets: alarmButton,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Звуковой эффект будильника
        const alarmWave = this.add.circle(alarmX, alarmY - 30 * scale, 10 * scale, 0xff0000, 0)
            .setStrokeStyle(Math.floor(2 * scale), 0xff0000);
        
        this.tweens.add({
            targets: alarmWave,
            radius: 30 * scale,
            alpha: 0,
            duration: 1000,
            repeat: -1,
            onStart: () => {
                alarmWave.alpha = 1;
            }
        });
        
        // 11. ОБРАБОТЧИКИ КНОПОК
        snoozeBtn.on('pointerdown', () => {
            snoozeCount++;
            snoozeText.setText(`Переносов: ${snoozeCount}/${maxSnooze}`);
            
            // Меняем время на телефоне
            const minutes = 45 + snoozeCount * 5;
            timeText.setText(`${Math.floor(minutes / 60) + 7}:${minutes % 60}`);
            
            // Эффект "еще поспал"
            this.cameras.main.shake(200, 0.01);
            
            // Добавляем стресс
            if (window.GameState) {
                window.GameState.stress += 5;
            }
            
            // Показываем кнопку больничного после 2 переносов
            if (snoozeCount >= 2) {
                sickBtn.setVisible(true);
                sickText.setVisible(true);
            }
            
            // Если достигли максимума
            if (snoozeCount >= maxSnooze) {
                snoozeBtn.disableInteractive();
                snoozeBtn.setFillStyle(0x666666);
                this.showMessage('⏰ БОЛЬШЕ НЕЛЬЗЯ! ПОРА ВСТАВАТЬ!');
            }
        });
        
        wakeBtn.on('pointerdown', () => {
    console.log('🔄 Переход в офис');
    // Простой переход без анимаций для Telegram
    this.scene.start('OfficeScene');
});
        
        sickBtn.on('pointerdown', () => {
            // Бонус за больничный
            if (window.GameState) {
                window.GameState.stress = 0;
                window.GameState.energy = 100;
                window.GameState.score += 50;
            }
            
            this.showMessage('✅ Больничный оформлен! +50 очков');
            
            this.time.delayedCall(1000, () => {
                this.cameras.main.fade(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.scene.start('OfficeScene');
                });
            });
        });
        
        // 12. ЗАПУСКАЕМ СИСТЕМУ ВРЕМЕНИ
        if (window.TimeSystem) {
            window.TimeSystem.init(9 * 60);
        }
    }
    
    showMessage(text) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const scale = Math.min(width / 800, height / 600);
        
        const msg = this.add.text(width / 2, height * 0.3, text, {
            fontSize: Math.floor(18 * scale) + 'px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10 * scale, y: 5 * scale }
        }).setOrigin(0.5).setDepth(1000);
        
        this.tweens.add({
            targets: msg,
            y: height * 0.25,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }
}

window.MorningScene = MorningScene;
console.log('🌅 MorningScene загружен');