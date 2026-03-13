// ==================== УТРЕННЯЯ СЦЕНА ====================

class MorningScene extends Phaser.Scene {
    constructor() {
        super('MorningScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        
        // Масштабируем всё под экран
        const scale = Math.min(width / 400, height / 800); // Базовая ориентация для телефона
        
        // 1. ФОН СПАЛЬНИ (градиент)
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a3a, 0x1a1a3a, 0x2a2a4a, 0x2a2a4a, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // 2. КРОВАТЬ (во весь экран)
        const bedY = height * 0.7; // Кровать в нижней части экрана
        
        // Основание кровати
        this.add.rectangle(centerX, bedY, width * 0.8, height * 0.2, 0x8B4513).setOrigin(0.5);
        
        // Матрас
        this.add.rectangle(centerX, bedY - height * 0.05, width * 0.75, height * 0.1, 0x5D3A1A).setOrigin(0.5);
        
        // Подушка
        this.add.ellipse(centerX - width * 0.15, bedY - height * 0.1, width * 0.15, height * 0.08, 0xfff5e6);
        
        // Одеяло
        this.add.rectangle(centerX, bedY - height * 0.02, width * 0.75, height * 0.05, 0x3498db, 0.5).setOrigin(0.5);
        
        // 3. ТУМБОЧКА (справа)
        const nightstandX = centerX + width * 0.3;
        const nightstandY = bedY - height * 0.05;
        this.add.rectangle(nightstandX, nightstandY, width * 0.15, height * 0.12, 0x8B4513).setOrigin(0.5);
        
        // 4. БУДИЛЬНИК (на тумбочке)
        const alarmX = nightstandX;
        const alarmY = nightstandY - height * 0.06;
        
        // Корпус будильника
        this.add.rectangle(alarmX, alarmY, width * 0.08, height * 0.1, 0xff3366).setOrigin(0.5);
        
        // Циферблат
        this.add.circle(alarmX, alarmY - height * 0.01, width * 0.03, 0xffffff);
        
        // Стрелки
        this.add.line(alarmX, alarmY - height * 0.01, 0, 0, 0, -height * 0.02, 0x000000).setOrigin(0, 0.5);
        this.add.line(alarmX, alarmY - height * 0.01, 0, 0, 0, -height * 0.015, 0x000000).setOrigin(0, 0.5);
        
        // Кнопка будильника
        const alarmButton = this.add.circle(alarmX, alarmY - height * 0.06, width * 0.01, 0xff0000);
        
        // 5. ТЕЛЕФОН (слева)
        const phoneX = centerX - width * 0.3;
        const phoneY = nightstandY;
        this.add.rectangle(phoneX, phoneY, width * 0.07, height * 0.12, 0x333333).setOrigin(0.5);
        this.add.rectangle(phoneX, phoneY - height * 0.03, width * 0.05, height * 0.07, 0x87CEEB).setOrigin(0.5);
        
        // Время на телефоне
        const timeText = this.add.text(phoneX, phoneY - height * 0.04, '7:45', {
            fontSize: Math.floor(width * 0.03) + 'px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // 6. ОКНО (вид на офис)
        this.add.rectangle(width * 0.15, height * 0.2, width * 0.2, height * 0.25, 0x87CEEB, 0.3).setOrigin(0.5);
        this.add.rectangle(width * 0.15, height * 0.2, width * 0.18, height * 0.23, 0x000000, 0.5).setOrigin(0.5);
        
        // 7. ТЕКСТ "УТРО"
        this.add.text(centerX, height * 0.1, '🌅 УТРО', {
            fontSize: Math.floor(width * 0.08) + 'px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#ff3366',
            strokeThickness: Math.floor(width * 0.01)
        }).setOrigin(0.5);
        
        // 8. СЧЕТЧИК БУДИЛЬНИКА
        let snoozeCount = 0;
        const maxSnooze = 3;
        
        const snoozeText = this.add.text(centerX, height * 0.18, `Переносов: ${snoozeCount}/${maxSnooze}`, {
            fontSize: Math.floor(width * 0.04) + 'px',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        // 9. КНОПКИ (БОЛЬШИЕ)
        const buttonY = height * 0.85;
        const buttonWidth = width * 0.4;
        const buttonHeight = height * 0.08;
        
        // Кнопка "Еще 5 минут"
        const snoozeBtn = this.add.rectangle(centerX - buttonWidth * 0.6, buttonY, buttonWidth, buttonHeight, 0xff3366)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(4, 0xffffff);
        
        this.add.text(centerX - buttonWidth * 0.6, buttonY, '😴 ЕЩЕ 5', {
            fontSize: Math.floor(width * 0.035) + 'px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Кнопка "Встать"
        const wakeBtn = this.add.rectangle(centerX + buttonWidth * 0.6, buttonY, buttonWidth, buttonHeight, 0x33ccff)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(4, 0xffffff);
        
        this.add.text(centerX + buttonWidth * 0.6, buttonY, '⏰ ВСТАТЬ', {
            fontSize: Math.floor(width * 0.035) + 'px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Кнопка "Больничный" (появляется позже)
        const sickBtn = this.add.rectangle(centerX, buttonY - height * 0.12, buttonWidth * 1.2, buttonHeight, 0x2ecc71)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(4, 0xffffff)
            .setVisible(false);
        
        const sickText = this.add.text(centerX, buttonY - height * 0.12, '🤒 ВЗЯТЬ БОЛЬНИЧНЫЙ', {
            fontSize: Math.floor(width * 0.035) + 'px',
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
        
        // 11. ОБРАБОТЧИКИ
        snoozeBtn.on('pointerdown', () => {
            snoozeCount++;
            snoozeText.setText(`Переносов: ${snoozeCount}/${maxSnooze}`);
            
            // Меняем время на телефоне
            const minutes = 45 + snoozeCount * 5;
            timeText.setText(`${Math.floor(minutes / 60) + 7}:${minutes % 60}`);
            
            this.cameras.main.shake(200, 0.01);
            
            if (window.GameState) {
                window.GameState.stress += 5;
            }
            
            if (snoozeCount >= 2) {
                sickBtn.setVisible(true);
                sickText.setVisible(true);
            }
            
            if (snoozeCount >= maxSnooze) {
                snoozeBtn.disableInteractive();
                snoozeBtn.setFillStyle(0x666666);
                this.showMessage('⏰ ПОРА ВСТАВАТЬ!', width);
            }
        });
        
        wakeBtn.on('pointerdown', () => {
            this.scene.start('OfficeScene');
        });
        
        sickBtn.on('pointerdown', () => {
            if (window.GameState) {
                window.GameState.stress = 0;
                window.GameState.energy = 100;
                window.GameState.score += 50;
            }
            
            this.showMessage('✅ Больничный! +50', width);
            
            this.time.delayedCall(1000, () => {
                this.scene.start('OfficeScene');
            });
        });
        
        // 12. ЗАПУСКАЕМ ВРЕМЯ
        if (window.TimeSystem) {
            window.TimeSystem.init(9 * 60);
        }
    }
    
    showMessage(text, width) {
        const msg = this.add.text(width / 2, this.cameras.main.height * 0.3, text, {
            fontSize: Math.floor(width * 0.04) + 'px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(1000);
        
        this.tweens.add({
            targets: msg,
            y: this.cameras.main.height * 0.25,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }
}

window.MorningScene = MorningScene;
console.log('🌅 MorningScene (большая версия) загружен');