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
        const centerX = width / 2;
        
        // Масштабируем размер тайлов под экран
        const scale = Math.min(width / 640, height / 480);
        this.tileSize = 32 * scale;
        
        // 1. СОЗДАЕМ КАРТУ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * this.tileSize;
                const y = row * this.tileSize;
                const tile = this.map[row][col];
                
                // Пол (плитка)
                if (tile === 2) {
                    this.add.image(x, y, 'floor').setOrigin(0).setScale(scale);
                } else {
                    // Стены
                    this.add.image(x, y, 'wall').setOrigin(0).setScale(scale);
                }
            }
        }
        
        // 2. СОЗДАЕМ ИГРОКА (центрируем)
        const playerStartX = 10 * this.tileSize;
        const playerStartY = 5 * this.tileSize;
        
        if (!this.player) {
            this.player = new Player(this, playerStartX, playerStartY);
        } else {
            this.player.sprite.setPosition(playerStartX, playerStartY);
        }
        
        // Масштабируем игрока
        this.player.sprite.setScale(scale);
        
        // 3. СОЗДАЕМ ПРЕДМЕТЫ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * this.tileSize + this.tileSize/2;
                const y = row * this.tileSize + this.tileSize/2;
                const tile = this.map[row][col];
                
                switch(tile) {
                    case 3: // Стол
                        const desk = this.add.image(x, y, 'desk').setScale(scale);
                        break;
                    case 4: // Кофемашина
                        const coffee = new CoffeeMachine(this, x, y);
                        coffee.sprite.setScale(scale);
                        this.items.push(coffee);
                        break;
                    case 5: // Печеньки
                        const cookies = new Cookies(this, x, y);
                        cookies.sprite.setScale(scale);
                        this.items.push(cookies);
                        break;
                    case 6: // Микроволновка
                        const microwave = this.add.image(x, y, 'printer').setScale(scale);
                        break;
                }
            }
        }
        
        // 4. НАСТРАИВАЕМ КАМЕРУ
        this.cameras.main.setBounds(0, 0, this.map[0].length * this.tileSize, this.map.length * this.tileSize);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(1);
        
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
        this.add.text(centerX, 30, '☕ КУХНЯ', {
            fontSize: Math.floor(24 * scale) + 'px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0);
    }

    createUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Верхняя панель (адаптивные отступы)
        const padding = Math.floor(width * 0.02);
        const fontSize = Math.floor(width * 0.05);
        
        this.scoreText = this.add.text(padding, padding, `🏆 ${window.GameState?.score || 0}`, {
            fontSize: fontSize + 'px',
            color: '#f1c40f'
        }).setScrollFactor(0);
        
        this.stressText = this.add.text(padding, padding + fontSize + 5, `😫 ${Math.round(window.GameState?.stress || 0)}%`, {
            fontSize: fontSize + 'px',
            color: '#2ecc71'
        }).setScrollFactor(0);
        
        this.energyText = this.add.text(padding + width * 0.15, padding, `⚡ ${Math.round(window.GameState?.energy || 100)}%`, {
            fontSize: fontSize + 'px',
            color: '#f39c12'
        }).setScrollFactor(0);
        
        // Время (справа)
        this.timeText = this.add.text(width - padding * 5, padding, window.TimeSystem?.getTimeString() || '09:00', {
            fontSize: fontSize + 'px',
            color: '#ffffff'
        }).setScrollFactor(0);
        
        // Кнопка "Назад в офис" (адаптивный размер)
        const btnSize = Math.floor(width * 0.06);
        const backBtn = this.add.circle(btnSize, height - btnSize, btnSize/2, 0x33ccff)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);
        
        this.add.text(btnSize, height - btnSize, '🏢', {
            fontSize: btnSize/2 + 'px'
        }).setOrigin(0.5).setScrollFactor(0);
        
        backBtn.on('pointerdown', () => {
            this.scene.start('OfficeScene');
        });
    }

    createDoors() {
        // Дверь в правом нижнем углу
        const doorX = (this.map[0].length - 2) * this.tileSize;
        const doorY = (this.map.length - 2) * this.tileSize;
        
        const door = this.add.rectangle(doorX + this.tileSize/2, doorY + this.tileSize/2, 
                                       this.tileSize * 1.5, this.tileSize * 1.5, 0xffaa00, 0.5)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(doorX + this.tileSize/2, doorY - 20, '🚪 В ОФИС', {
            fontSize: Math.floor(14 * (this.tileSize/32)) + 'px',
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
            result = item.hit();
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
        const height = this.cameras.main.height;
        
        const msg = this.add.text(width / 2, height * 0.2, text, {
            fontSize: Math.floor(width * 0.04) + 'px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        this.tweens.add({
            targets: msg,
            y: height * 0.15,
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