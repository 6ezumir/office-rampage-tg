// ==================== СЦЕНА МЕНЮ ====================

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 1. ГРАДИЕНТНЫЙ ФОН (НОЧНОЙ ОФИС)
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3a, 0x1a1a3a, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // 2. ОФИСНЫЙ ГОРИЗОНТ (ПИКСЕЛЬ-АРТ)
        for(let i = 0; i < 8; i++) {
            const x = i * 100;
            
            // Здание
            this.add.rectangle(x + 30, height - 150, 40, 120, 0x2c3e50).setOrigin(0.5);
            
            // Окна (некоторые светятся)
            for(let w = 0; w < 3; w++) {
                const windowY = height - 190 + w * 25;
                
                // Рамка окна
                this.add.rectangle(x + 20, windowY, 12, 18, 0x1a1a2e).setOrigin(0.5);
                
                // Свет в окне (случайно)
                if (Math.random() > 0.5) {
                    this.add.rectangle(x + 20, windowY, 8, 12, 0xf1c40f).setOrigin(0.5);
                } else {
                    this.add.rectangle(x + 40, windowY, 8, 12, 0x3498db).setOrigin(0.5);
                }
            }
        }
        
        // 3. ЗВЕЗДЫ (АНИМИРОВАННЫЕ)
        for(let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height / 2);
            const star = this.add.circle(x, y, 1 + Math.random() * 2, 0xffffff, 0.5 + Math.random() * 0.5);
            
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: 1000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }
        
        // 4. ЛУНА
        this.add.circle(100, 80, 30, 0xfff5e6);
        this.add.circle(115, 70, 5, 0xcccccc);
        
        // 5. ЗАГОЛОВОК С СИЯНИЕМ
        const title1 = this.add.text(width / 2, 180, 'ОФИСНЫЙ', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#ff3366',
            strokeThickness: 6,
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: '#ff3366',
                blur: 10,
                fill: true
            }
        }).setOrigin(0.5);
        
        const title2 = this.add.text(width / 2, 240, 'КОШМАР', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#33ccff',
            strokeThickness: 6,
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: '#33ccff',
                blur: 10,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Анимация заголовка
        this.tweens.add({
            targets: [title1, title2],
            y: '-=5',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 6. КНОПКИ МЕНЮ
        const buttons = [
            { text: '▶ НАЧАТЬ ДЕНЬ', y: 350, color: 0x33ccff, scene: 'MorningScene' },
            { text: '📖 ИСТОРИЯ', y: 420, color: 0xff3366, scene: null },
            { text: '⚙️ НАСТРОЙКИ', y: 490, color: 0x2ecc71, scene: null }
        ];
        
        buttons.forEach(btn => {
            // Контейнер для кнопки
            const btnBg = this.add.rectangle(width / 2, btn.y, 250, 50, btn.color)
                .setInteractive({ useHandCursor: true })
                .setStrokeStyle(2, 0xffffff);
            
            const btnText = this.add.text(width / 2, btn.y, btn.text, {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            // Эффекты при наведении
            btnBg.on('pointerover', () => {
                this.tweens.add({
                    targets: [btnBg, btnText],
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 200
                });
            });
            
            btnBg.on('pointerout', () => {
                this.tweens.add({
                    targets: [btnBg, btnText],
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200
                });
            });
            
            btnBg.on('pointerdown', () => {
                if (btn.scene) {
                    // Эффект затухания
                    this.cameras.main.fade(500, 0, 0, 0);
                    this.time.delayedCall(500, () => {
                        this.scene.start(btn.scene);
                    });
                } else {
                    this.showMessage('Скоро будет...');
                }
            });
        });
        
        // 7. ИНФОРМАЦИЯ О СОХРАНЕНИИ
        if (window.SaveSystem && window.SaveSystem.hasSave()) {
            this.add.text(width / 2, 550, '📀 Есть сохранение', {
                fontSize: '14px',
                color: '#33ccff'
            }).setOrigin(0.5);
        }
        
        // 8. ВЕРСИЯ
        this.add.text(10, height - 20, 'v0.1 Alpha', {
            fontSize: '12px',
            color: '#ffffff',
            alpha: 0.5
        });
        
        // 9. TELEGRAM
        if (window.tg) {
            this.add.text(width - 100, height - 20, 'TG Mini App', {
                fontSize: '12px',
                color: '#33ccff',
                alpha: 0.7
            });
        }
        
        // 10. ПАСХАЛКА (Котик в окне)
        const catWindow = this.add.rectangle(700, 120, 30, 40, 0xf1c40f).setOrigin(0.5);
        this.add.text(693, 112, '🐱', {
            fontSize: '16px'
        });
        
        // Анимация котика
        this.tweens.add({
            targets: catWindow,
            y: '+=5',
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
    
    showMessage(text) {
        const width = this.cameras.main.width;
        
        const msg = this.add.text(width / 2, 300, text, {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(1000);
        
        this.tweens.add({
            targets: msg,
            y: 250,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }
}

window.MenuScene = MenuScene;
console.log('🎬 MenuScene загружен');