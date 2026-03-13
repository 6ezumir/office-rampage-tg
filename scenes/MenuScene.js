// ==================== СЦЕНА МЕНЮ ====================

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Масштабируем всё под экран
        const scale = Math.min(width / 800, height / 600);
        const titleSize = Math.floor(64 * scale);
        const buttonWidth = Math.floor(250 * scale);
        const buttonHeight = Math.floor(50 * scale);
        const buttonSpacing = Math.floor(70 * scale);
        
        // 1. ГРАДИЕНТНЫЙ ФОН (НОЧНОЙ ОФИС)
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3a, 0x1a1a3a, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // 2. ОФИСНЫЙ ГОРИЗОНТ (ПИКСЕЛЬ-АРТ) - адаптивный
        const buildingWidth = Math.floor(40 * scale);
        const buildingHeight = Math.floor(120 * scale);
        const windowSize = Math.floor(8 * scale);
        
        for(let i = 0; i < 8; i++) {
            const x = i * (width / 8);
            
            // Здание
            this.add.rectangle(x + buildingWidth/2, height - 150 * scale, 
                              buildingWidth, buildingHeight, 0x2c3e50).setOrigin(0.5);
            
            // Окна
            for(let w = 0; w < 3; w++) {
                const windowY = height - 190 * scale + w * 25 * scale;
                
                // Рамка окна
                this.add.rectangle(x + buildingWidth/4, windowY, 
                                  windowSize * 1.5, windowSize * 2, 0x1a1a2e).setOrigin(0.5);
                
                // Свет в окне
                if (Math.random() > 0.5) {
                    this.add.rectangle(x + buildingWidth/4, windowY, 
                                      windowSize, windowSize * 1.5, 0xf1c40f).setOrigin(0.5);
                } else {
                    this.add.rectangle(x + buildingWidth * 0.75, windowY, 
                                      windowSize, windowSize * 1.5, 0x3498db).setOrigin(0.5);
                }
            }
        }
        
        // 3. ЗВЕЗДЫ (АНИМИРОВАННЫЕ) - адаптивные
        for(let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height * 0.4);
            const starSize = 1 + Math.random() * 2 * scale;
            const star = this.add.circle(x, y, starSize, 0xffffff, 0.5 + Math.random() * 0.5);
            
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: 1000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }
        
        // 4. ЛУНА - адаптивная
        const moonX = Math.floor(100 * scale);
        const moonY = Math.floor(80 * scale);
        this.add.circle(moonX, moonY, 30 * scale, 0xfff5e6);
        this.add.circle(moonX + 15 * scale, moonY - 10 * scale, 5 * scale, 0xcccccc);
        
        // 5. ЗАГОЛОВОК С СИЯНИЕМ - адаптивный
        const title1 = this.add.text(centerX, centerY - 120 * scale, 'ОФИСНЫЙ', {
            fontSize: Math.floor(64 * scale) + 'px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#ff3366',
            strokeThickness: Math.floor(6 * scale),
            shadow: {
                offsetX: 5 * scale,
                offsetY: 5 * scale,
                color: '#ff3366',
                blur: 10 * scale,
                fill: true
            }
        }).setOrigin(0.5);
        
        const title2 = this.add.text(centerX, centerY - 60 * scale, 'КОШМАР', {
            fontSize: Math.floor(64 * scale) + 'px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#33ccff',
            strokeThickness: Math.floor(6 * scale),
            shadow: {
                offsetX: 5 * scale,
                offsetY: 5 * scale,
                color: '#33ccff',
                blur: 10 * scale,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Анимация заголовка
        this.tweens.add({
            targets: [title1, title2],
            y: '-=' + (5 * scale),
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 6. КНОПКИ МЕНЮ - адаптивные
        const buttons = [
            { text: '▶ НАЧАТЬ ДЕНЬ', y: centerY + 50 * scale, color: 0x33ccff, scene: 'MorningScene' },
            { text: '📖 ИСТОРИЯ', y: centerY + 120 * scale, color: 0xff3366, scene: null },
            { text: '⚙️ НАСТРОЙКИ', y: centerY + 190 * scale, color: 0x2ecc71, scene: null }
        ];
        
        buttons.forEach(btn => {
            // Контейнер для кнопки
            const btnBg = this.add.rectangle(centerX, btn.y, buttonWidth, buttonHeight, btn.color)
                .setInteractive({ useHandCursor: true })
                .setStrokeStyle(Math.floor(2 * scale), 0xffffff);
            
            const btnText = this.add.text(centerX, btn.y, btn.text, {
                fontSize: Math.floor(24 * scale) + 'px',
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
            this.add.text(centerX, height - 50 * scale, '📀 Есть сохранение', {
                fontSize: Math.floor(14 * scale) + 'px',
                color: '#33ccff'
            }).setOrigin(0.5);
        }
        
        // 8. ВЕРСИЯ
        this.add.text(10 * scale, height - 20 * scale, 'v0.1 Alpha', {
            fontSize: Math.floor(12 * scale) + 'px',
            color: '#ffffff',
            alpha: 0.5
        });
        
        // 9. TELEGRAM
        if (window.tg) {
            this.add.text(width - 100 * scale, height - 20 * scale, 'TG Mini App', {
                fontSize: Math.floor(12 * scale) + 'px',
                color: '#33ccff',
                alpha: 0.7
            });
        }
        
        // 10. ПАСХАЛКА (Котик в окне) - адаптивная
        const catX = width * 0.8;
        const catY = height * 0.15;
        const catWindow = this.add.rectangle(catX, catY, 30 * scale, 40 * scale, 0xf1c40f).setOrigin(0.5);
        this.add.text(catX - 5 * scale, catY - 8 * scale, '🐱', {
            fontSize: Math.floor(16 * scale) + 'px'
        });
        
        // Анимация котика
        this.tweens.add({
            targets: catWindow,
            y: catY + 5 * scale,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
    
    showMessage(text) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const scale = Math.min(width / 800, height / 600);
        
        const msg = this.add.text(width / 2, height / 2, text, {
            fontSize: Math.floor(24 * scale) + 'px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20 * scale, y: 10 * scale }
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
console.log('🎬 MenuScene загружен');