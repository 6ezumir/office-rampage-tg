// ==================== МЕНЮ В СТИЛЕ "РАЗГРОМ" ====================

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Масштаб для адаптации
        const scale = Math.min(width / 800, height / 600);
        
        // 1. РАЗРУШЕННЫЙ ФОН
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // 2. ТРЕЩИНЫ НА ЭКРАНЕ (эффект разбитого стекла)
        const cracks = this.add.graphics();
        cracks.lineStyle(4 * scale, 0xffffff, 0.3);
        
        // Рисуем случайные трещины
        for(let i = 0; i < 8; i++) {
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            cracks.beginPath();
            cracks.moveTo(startX, startY);
            
            for(let j = 0; j < 5; j++) {
                cracks.lineTo(
                    startX + (Math.random() - 0.5) * 200 * scale,
                    startY + (Math.random() - 0.5) * 200 * scale
                );
            }
            cracks.strokePath();
        }
        
        // 3. РАЗЛЕТАЮЩИЕСЯ ЧАСТИЦЫ (бумага, пыль)
        for(let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 5 * scale + Math.random() * 10 * scale;
            
            // Случайные формы (обрывки бумаги)
            if (Math.random() > 0.5) {
                const paper = this.add.rectangle(x, y, size, size * 0.7, 0xcccccc, 0.3);
                paper.angle = Math.random() * 360;
                
                // Анимация парения
                this.tweens.add({
                    targets: paper,
                    y: y + 50 * scale,
                    x: x + 20 * scale,
                    rotation: paper.angle + 45,
                    alpha: 0.1,
                    duration: 3000 + Math.random() * 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            } else {
                const dot = this.add.circle(x, y, size * 0.3, 0xff3366, 0.2);
                
                this.tweens.add({
                    targets: dot,
                    y: y - 100 * scale,
                    x: x + (Math.random() - 0.5) * 100 * scale,
                    alpha: 0,
                    duration: 2000 + Math.random() * 2000,
                    repeat: -1,
                    ease: 'Linear'
                });
            }
        }
        
        // 4. РАЗРУШЕННАЯ ВЫВЕСКА
        // Буквы падают/трясутся
        const letters = [
            { char: 'О', x: centerX - 200 * scale, y: centerY - 150 * scale, color: 0xff3366 },
            { char: 'Ф', x: centerX - 120 * scale, y: centerY - 150 * scale, color: 0xff3366 },
            { char: 'И', x: centerX - 40 * scale, y: centerY - 150 * scale, color: 0xff3366 },
            { char: 'С', x: centerX + 40 * scale, y: centerY - 150 * scale, color: 0x33ccff },
            { char: 'Н', x: centerX + 120 * scale, y: centerY - 150 * scale, color: 0x33ccff },
            { char: 'Ы', x: centerX + 200 * scale, y: centerY - 150 * scale, color: 0x33ccff },
            { char: 'Й', x: centerX + 280 * scale, y: centerY - 150 * scale, color: 0x33ccff }
        ];
        
        letters.forEach(letter => {
            const text = this.add.text(letter.x, letter.y, letter.char, {
                fontSize: 64 * scale + 'px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
                stroke: Phaser.Display.Color.IntegerToColor(letter.color).rgba,
                strokeThickness: 6 * scale,
                shadow: {
                    offsetX: 3 * scale,
                    offsetY: 3 * scale,
                    color: '#000',
                    blur: 5 * scale,
                    fill: true
                }
            }).setOrigin(0.5);
            
            // Каждая буква трясётся по-своему
            this.tweens.add({
                targets: text,
                y: letter.y + (Math.random() * 10 - 5) * scale,
                x: letter.x + (Math.random() * 10 - 5) * scale,
                angle: Math.random() * 5 - 2.5,
                duration: 200 + Math.random() * 300,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // 5. РАЗБИТАЯ ТАБЛИЧКА "КОШМАР"
        const nightmare = this.add.text(centerX, centerY - 50 * scale, 'КОШМАР', {
            fontSize: 48 * scale + 'px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8 * scale
        }).setOrigin(0.5);
        
        // Эффект "дрожания"
        this.tweens.add({
            targets: nightmare,
            angle: 2,
            duration: 100,
            yoyo: true,
            repeat: -1
        });
        
        // 6. РАЗРУШЕННЫЕ КНОПКИ
        const buttons = [
            { text: '▶ НАЧАТЬ РАЗГРОМ', y: centerY + 100 * scale, color: 0xff3366, scene: 'MorningScene' },
            { text: '📋 ИСТОРИЯ', y: centerY + 170 * scale, color: 0x33ccff, scene: null },
            { text: '⚙️ НАСТРОЙКИ', y: centerY + 240 * scale, color: 0x2ecc71, scene: null }
        ];
        
        buttons.forEach(btn => {
            // Кнопка с рваными краями
            const btnBg = this.add.graphics();
            btnBg.fillStyle(btn.color, 0.8);
            btnBg.fillRoundedRect(
                centerX - 150 * scale, 
                btn.y - 25 * scale, 
                300 * scale, 
                50 * scale, 
                10 * scale
            );
            
            // Эффект "разрушения" - белые линии
            btnBg.lineStyle(2 * scale, 0xffffff, 0.5);
            for(let i = 0; i < 5; i++) {
                btnBg.beginPath();
                btnBg.moveTo(
                    centerX - 150 * scale + Math.random() * 300 * scale,
                    btn.y - 25 * scale
                );
                btnBg.lineTo(
                    centerX - 150 * scale + Math.random() * 300 * scale,
                    btn.y + 25 * scale
                );
                btnBg.strokePath();
            }
            
            // Текст кнопки
            const btnText = this.add.text(centerX, btn.y, btn.text, {
                fontSize: 24 * scale + 'px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            // Зона клика (невидимая, но поверх кнопки)
            const hitArea = this.add.rectangle(centerX, btn.y, 300 * scale, 50 * scale, 0x000000, 0)
                .setInteractive({ useHandCursor: true });
            
            hitArea.on('pointerover', () => {
                btnBg.clear();
                btnBg.fillStyle(btn.color, 1);
                btnBg.fillRoundedRect(centerX - 150 * scale, btn.y - 25 * scale, 300 * scale, 50 * scale, 10 * scale);
                btnText.setScale(1.1);
            });
            
            hitArea.on('pointerout', () => {
                btnBg.clear();
                btnBg.fillStyle(btn.color, 0.8);
                btnBg.fillRoundedRect(centerX - 150 * scale, btn.y - 25 * scale, 300 * scale, 50 * scale, 10 * scale);
                btnText.setScale(1);
            });
            
            hitArea.on('pointerdown', () => {
                if (btn.scene) {
                    this.cameras.main.fadeOut(500);
                    this.time.delayedCall(500, () => {
                        this.scene.start(btn.scene);
                    });
                } else {
                    this.showBrokenMessage(scale);
                }
            });
        });
        
        // 7. РАЗБИТЫЕ ЧАСЫ (время до конца света)
        const clockX = width - 100 * scale;
        const clockY = 80 * scale;
        
        // Разбитый циферблат
        this.add.circle(clockX, clockY, 30 * scale, 0x333333, 0.5);
        this.add.circle(clockX, clockY, 25 * scale, 0x666666, 0.5);
        
        // Трещина на часах
        const clockCrack = this.add.graphics();
        clockCrack.lineStyle(3 * scale, 0xff0000, 0.5);
        clockCrack.beginPath();
        clockCrack.moveTo(clockX - 20 * scale, clockY - 15 * scale);
        clockCrack.lineTo(clockX + 20 * scale, clockY + 15 * scale);
        clockCrack.strokePath();
        
        // 8. ВЕРСИЯ (едва заметно)
        this.add.text(10 * scale, height - 30 * scale, 'v0.1 - АЛЬФА-РАЗРУШЕНИЕ', {
            fontSize: 12 * scale + 'px',
            color: '#ffffff',
            alpha: 0.3
        });
        
        // 9. ПАСХАЛКА - летящий кирпич
        const brick = this.add.rectangle(width - 50 * scale, 150 * scale, 20 * scale, 10 * scale, 0x8B4513);
        brick.angle = 45;
        
        this.tweens.add({
            targets: brick,
            x: width,
            y: height,
            rotation: 360,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });
    }
    
    showBrokenMessage(scale) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const msg = this.add.text(width / 2, height / 2, '💥 РАЗРУШЕНО 💥\nСкоро починим...', {
            fontSize: 24 * scale + 'px',
            color: '#ffffff',
            backgroundColor: '#ff3366',
            padding: { x: 20 * scale, y: 10 * scale },
            align: 'center'
        }).setOrigin(0.5).setDepth(1000);
        
        this.tweens.add({
            targets: msg,
            y: height / 2 - 50 * scale,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }
}

window.MenuScene = MenuScene;
console.log('💥 Разрушенное меню загружено');