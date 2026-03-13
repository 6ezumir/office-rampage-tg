// ==================== КУХНЯ ====================

class KitchenScene extends Phaser.Scene {
    constructor() {
        super('KitchenScene');
        
        // Карта кухни (0-пусто, 1-стена, 2-пол, 3-стол, 4-кофемашина, 5-печеньки, 6-микроволновка)
        this.map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,4,2,5,2,6,2,4,2,2,5,2,6,2,4,2,5,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,3,2,3,2,3,2,3,2,2,3,2,3,2,3,2,3,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,4,2,5,2,6,2,4,2,2,5,2,6,2,4,2,5,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,3,2,3,2,3,2,3,2,2,3,2,3,2,3,2,3,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.tileSize = 32;
        this.player = null;
        this.items = [];
        this.cursors = null;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 1. СОЗДАЕМ КАРТУ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * this.tileSize;
                const y = row * this.tileSize;
                const tile = this.map[row][col];
                
                // Пол (плитка)
                if (tile === 2) {
                    this.add.image(x, y, 'floor').setOrigin(0);
                } else {
                    // Стены
                    this.add.image(x, y, 'wall').setOrigin(0);
                }
            }
        }
        
        // 2. СОЗДАЕМ ИГРОКА (центрируем)
        if (!this.player) {
            this.player = new Player(this, 300, 300);
        } else {
            this.player.sprite.setPosition(300, 300);
        }
        
        // 3. СОЗДАЕМ ПРЕДМЕТЫ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * this.tileSize + 16;
                const y = row * this.tileSize + 16;
                const tile = this.map[row][col];
                
                switch(tile) {
                    case 3: // Стол
                        this.add.image(x, y, 'desk');
                        break;
                    case 4: // Кофемашина
                        const coffee = new CoffeeMachine(this, x, y);
                        this.items.push(coffee);
                        break;
                    case 5: // Печеньки
                        const cookies = new Cookies(this, x, y);
                        this.items.push(cookies);
                        break;
                    case 6: // Микроволновка (используем ту же текстуру что и принтер, но с другим смыслом)
                        this.add.image(x, y, 'printer');
                        break;
                }
            }
        }
        
        // 4. НАСТРАИВАЕМ КАМЕРУ
        this.cameras.main.setBounds(0, 0, 20 * 32, 11 * 32);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(2);
        
        // 5. УПРАВЛЕНИЕ
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 6. ИНТЕРФЕЙС
        this.createUI();
        
        // 7. ДВЕРИ (переходы)
        this.createDoors();
        
        // 8. ОБРАБОТЧИК ТАЧЕЙ
        this.input.on('pointerdown', (pointer) => {
            if (!pointer.targetObject) {
                this.player.moveTo(pointer.worldX, pointer.worldY);
            }
        });
        
        // 9. ОБРАБОТЧИК ВЗАИМОДЕЙСТВИЯ С ПРЕДМЕТАМИ
        this.input.on('gameobjectdown', (pointer, obj) => {
            this.interactWithItem(obj);
        });
        
        // 10. НАЗВАНИЕ ЛОКАЦИИ
        this.add.text(width / 2, 20, '☕ КУХНЯ', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0);
    }

    createUI() {
        const width = this.cameras.main.width;
        
        // Верхняя панель
        this.scoreText = this.add.text(10, 10, `🏆 ${window.GameState?.score || 0}`, {
            fontSize: '20px',
            color: '#f1c40f'
        }).setScrollFactor(0);
        
        this.stressText = this.add.text(10, 35, `😫 ${Math.round(window.GameState?.stress || 0)}%`, {
            fontSize: '20px',
            color: '#2ecc71'
        }).setScrollFactor(0);
        
        this.energyText = this.add.text(150, 10, `⚡ ${Math.round(window.GameState?.energy || 100)}%`, {
            fontSize: '20px',
            color: '#f39c12'
        }).setScrollFactor(0);
        
        // Время
        this.timeText = this.add.text(width - 100, 10, window.TimeSystem?.getTimeString() || '09:00', {
            fontSize: '24px',
            color: '#ffffff'
        }).setScrollFactor(0);
        
        // Кнопка "Назад в офис"
        const backBtn = this.add.circle(50, 50, 20, 0x33ccff)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);
        
        this.add.text(50, 50, '🏢', {
            fontSize: '20px'
        }).setOrigin(0.5).setScrollFactor(0);
        
        backBtn.on('pointerdown', () => {
            this.scene.start('OfficeScene');
        });
    }

    createDoors() {
        const door = this.add.rectangle(10 * 32, 10 * 32, 40, 40, 0xffaa00, 0.5)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(10 * 32, 10 * 32 - 20, '🚪 В ОФИС', {
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        door.on('pointerdown', () => {
            this.scene.start('OfficeScene');
        });
    }

    interactWithItem(obj) {
        // Ищем предмет в массиве по спрайту
        const item = this.items.find(i => i.sprite === obj);
        
        if (!item) return;
        
        let result;
        
        if (item instanceof CoffeeMachine) {
            result = item.use();
            if (result.brewing) {
                // Если кофе варится, завершим через время
                this.time.delayedCall(5000, () => {
                    const finish = item.finishBrewing();
                    this.showMessage(finish.message);
                    
                    if (finish.effect && window.GameState) {
                        window.GameState.energy = Math.min(100, (window.GameState.energy || 100) + finish.effect.energy);
                        window.GameState.stress = Math.max(0, (window.GameState.stress || 0) + finish.effect.stress);
                    }
                });
            }
        } else if (item instanceof Cookies) {
            result = item.take();
        } else if (item instanceof Printer) {
            result = item.hit(); // На кухне принтеров нет, но на всякий случай
        }
        
        if (result) {
            this.showMessage(result.message);
            
            if (result.effect && window.GameState) {
                if (result.effect.energy) {
                    window.GameState.energy = Math.min(100, (window.GameState.energy || 100) + result.effect.energy);
                }
                if (result.effect.stress) {
                    window.GameState.stress = Math.max(0, Math.min(100, (window.GameState.stress || 0) + result.effect.stress));
                }
                if (result.effect.score) {
                    window.GameState.score = (window.GameState.score || 0) + result.effect.score;
                }
            }
        }
    }

    showMessage(text) {
        const width = this.cameras.main.width;
        
        const msg = this.add.text(width / 2, 100, text, {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        this.tweens.add({
            targets: msg,
            y: 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }

    update() {
        if (!this.player) return;
        
        // Движение игрока
        this.player.move(this.cursors);
        this.player.update();
        
        // Обновление предметов
        this.items.forEach(item => {
            if (item.updatePosition) {
                item.updatePosition();
            }
        });
        
        // Обновление UI
        this.updateUI();
        
        // Обновление времени
        if (window.TimeSystem) {
            window.TimeSystem.update('KitchenScene', false);
            this.timeText.setText(window.TimeSystem.getTimeString());
        }
    }

    updateUI() {
        if (window.GameState) {
            this.scoreText.setText(`🏆 ${window.GameState.score || 0}`);
            this.stressText.setText(`😫 ${Math.round(window.GameState.stress || 0)}%`);
            this.energyText.setText(`⚡ ${Math.round(window.GameState.energy || 100)}%`);
            
            // Меняем цвет стресса
            if (window.GameState.stress > 70) {
                this.stressText.setColor('#e74c3c');
            } else if (window.GameState.stress > 40) {
                this.stressText.setColor('#f39c12');
            } else {
                this.stressText.setColor('#2ecc71');
            }
        }
    }
}

window.KitchenScene = KitchenScene;
console.log('☕ KitchenScene загружен');