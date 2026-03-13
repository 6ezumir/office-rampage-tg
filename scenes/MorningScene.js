// ==================== УТРЕННЯЯ СЦЕНА ====================

class MorningScene extends Phaser.Scene {
    constructor() {
        super('MorningScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 1. ФОН СПАЛЬНИ
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a3a, 0x1a1a3a, 0x2a2a4a, 0x2a2a4a, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // 2. КРОВАТЬ (пиксель-арт)
        // Основание кровати
        this.add.rectangle(width / 2, height - 100, 300, 80, 0x8B4513).setOrigin(0.5);
        
        // Матрас
        this.add.rectangle(width / 2, height - 130, 280, 40, 0x5D3A1A).setOrigin(0.5);
        
        // Подушка
        this.add.ellipse(width / 2 - 50, height - 140, 60, 30, 0xfff5e6);
        
        // Одеяло
        this.add.rectangle(width / 2, height - 115, 280, 20, 0x3498db, 0.3).setOrigin(0.5);
        
        // 3. ТУМБОЧКА
        this.add.rectangle(width / 2 + 120, height - 120, 60, 50, 0x8B4513).setOrigin(0.5);
        
        // 4. БУДИЛЬНИК (на тумбочке)
        const alarmX = width / 2 + 120;
        const alarmY = height - 140;
        
        // Корпус будильника
        this.add.rectangle(alarmX, alarmY, 40, 50, 0xff3366).setOrigin(0.5);
        
        // Циферблат
        this.add.circle(alarmX, alarmY - 5, 15, 0xffffff);
        
        // Стрелки
        this.add.line(alarmX, alarmY - 5, 0, 0, 0, -10, 0x000000).setOrigin(0, 0.5);
        this.add.line(alarmX, alarmY - 5, 0, 0, 0, -8, 0x000000).setOrigin(0, 0.5);
        
        // Кнопка будильника сверху
        const alarmButton = this.add.circle(alarmX, alarmY - 30, 5, 0xff0000);
        
        // 5. ТЕЛЕФОН
        this.add.rectangle(width / 2 - 100, height - 140, 30, 50, 0x333333).setOrigin(0.5);
        this.add.rectangle(width / 2 - 100, height - 150, 20, 30, 0x87CEEB).setOrigin(0.5);
        
        // Время на телефоне
        const timeText = this.add.text(width / 2 - 100, height - 155, '7:45', {
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 6. ОКНО (вид на офис)
        this.add.rectangle(100, 150, 80, 100, 0x87CEEB, 0.3).setOrigin(0.5);
        this.add.rectangle(100, 150, 76, 96, 0x000000, 0.5).setOrigin(0.5);
        
        // 7. ТЕКСТ "УТРО"
        this.add.text(width / 2, 50, '🌅 УТРО', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#ff3366',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // 8. СЧЕТЧИК БУДИЛЬНИКА
        let snoozeCount = 0;
        const maxSnooze = 3;
        
        const snoozeText = this.add.text(width / 2, 100, `Переносов: ${snoozeCount}/${maxSnooze}`, {
            fontSize: '16px',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        // 9. КНОПКИ
        // Кнопка "Еще 5 минут"
        const snoozeBtn = this.add.rectangle(width / 2 - 150, height - 50, 200, 50, 0xff3366)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff);
        
        this.add.text(width / 2 - 150, height - 50, '😴 ЕЩЕ 5 МИНУТ', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Кнопка "Встать"
        const wakeBtn = this.add.rectangle(width / 2 + 150, height - 50, 150, 50, 0x33ccff)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff);
        
        this.add.text(width / 2 + 150, height - 50, '⏰ ВСТАТЬ', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Кнопка "Больничный" (появляется после переносов)
        const sickBtn = this.add.rectangle(width / 2, height - 120, 200, 40, 0x2ecc71)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff)
            .setVisible(false);
        
        const sickText = this.add.text(width / 2, height - 120, '🤒 ВЗЯТЬ БОЛЬНИЧНЫЙ', {
            fontSize: '14px',
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
        
        // Звуковой эффект будильника (визуальный)
        const alarmWave = this.add.circle(alarmX, alarmY - 30, 10, 0xff0000, 0).setStrokeStyle(2, 0xff0000);
        
        this.tweens.add({
            targets: alarmWave,
            radius: 30,
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
            const time = 7 + Math.floor(45 + snoozeCount * 5) / 60;
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
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('OfficeScene');
            });
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
            window.TimeSystem.init(9 * 60); // 9:00 утра
        }
    }
    
    showMessage(text) {
        const width = this.cameras.main.width;
        
        const msg = this.add.text(width / 2, 200, text, {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setDepth(1000);
        
        this.tweens.add({
            targets: msg,
            y: 150,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }
}

window.MorningScene = MorningScene;
console.log('🌅 MorningScene загружен');