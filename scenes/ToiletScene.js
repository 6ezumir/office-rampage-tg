// ==================== ТУАЛЕТ ====================

class ToiletScene extends Phaser.Scene {
    constructor() {
        super('ToiletScene');
        
        // Карта туалета (0-пусто, 1-стена, 2-пол, 3-кабинка, 4-раковина, 5-зеркало)
        this.map = [
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,3,2,3,2,2,2,1],
            [1,2,4,2,2,3,2,3,2,4,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,5,2,2,3,2,3,2,5,2,1],
            [1,2,2,2,2,3,2,3,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.tileSize = 32;
        this.player = null;
        this.hidingSpots = [];
        this.cursors = null;
        this.isHiding = false;
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
                
                if (tile === 2) {
                    // Пол (плитка)
                    this.add.image(x, y, 'floor').setOrigin(0);
                } else if (tile === 1) {
                    // Стены
                    this.add.image(x, y, 'wall').setOrigin(0);
                }
            }
        }
        
        // 2. ДОБАВЛЯЕМ ДЕКОР
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * this.tileSize + 16;
                const y = row * this.tileSize + 16;
                const tile = this.map[row][col];
                
                switch(tile) {
                    case 3: // Кабинка (место для пряток)
                        const cabin = this.add.rectangle(x, y, 28, 28, 0x8B4513, 0.5);
                        cabin.setData('hiding', true);
                        cabin.setInteractive({ useHandCursor: true });
                        this.hidingSpots.push(cabin);
                        
                        // Дверца кабинки
                        this.add.rectangle(x - 8, y, 4, 20, 0xCD853F);
                        break;
                        
                    case 4: // Раковина
                        this.add.ellipse(x, y, 20, 10, 0xffffff);
                        this.add.circle(x - 5, y - 5, 3, 0x3498db);
                        this.add.circle(x + 5, y - 5, 3, 0x3498db);
                        break;
                        
                    case 5: // Зеркало
                        this.add.rectangle(x, y, 20, 24, 0x87CEEB, 0.3);
                        this.add.rectangle(x, y, 18, 22, 0x000000, 0.5);
                        break;
                }
            }
        }
        
        // 3. СОЗДАЕМ ИГРОКА
        this.player = new Player(this, 200, 200);
        
        // 4. НАСТРАИВАЕМ КАМЕРУ
        this.cameras.main.setBounds(0, 0, 12 * 32, 7 * 32);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(3);
        
        // 5. УПРАВЛЕНИЕ
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 6. ИНТЕРФЕЙС
        this.createUI();
        
        // 7. ДВЕРИ
        this.createDoors();
        
        // 8. ОБРАБОТЧИК ТАЧЕЙ
        this.input.on('pointerdown', (pointer) => {
            if (!pointer.targetObject) {
                this.player.moveTo(pointer.worldX, pointer.worldY);
            }
        });
        
        // 9. ОБРАБОТЧИК ПРЯТОК
        this.hidingSpots.forEach(spot => {
            spot.on('pointerdown', () => {
                this.toggleHide(spot);
            });
        });
        
        // 10. ЭФФЕКТ ТУАЛЕТА (можно спрятаться от стресса)
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.isHiding && window.GameState) {
                    window.GameState.stress = Math.max(0, (window.GameState.stress || 0) - 5);
                    this.showMessage('😮‍💨 Отдых... Стресс -5');
                }
            },
            loop: true
        });
        
        // 11. НАЗВАНИЕ ЛОКАЦИИ
        this.add.text(width / 2, 20, '🚽 ТУАЛЕТ', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0);
        
        // 12. ЗВУКИ (визуальные)
        this.createSounds();
    }

    createUI() {
        const width = this.cameras.main.width;
        
        // Статусы
        this.scoreText = this.add.text(10, 10, `🏆 ${window.GameState?.score || 0}`, {
            fontSize: '20px',
            color: '#f1c40f'
        }).setScrollFactor(0);
        
        this.stressText = this.add.text(10, 35, `😫 ${Math.round(window.GameState?.stress || 0)}%`, {
            fontSize: '20px',
            color: '#2ecc71'
        }).setScrollFactor(0);
        
        // Время
        this.timeText = this.add.text(width - 100, 10, window.TimeSystem?.getTimeString() || '09:00', {
            fontSize: '24px',
            color: '#ffffff'
        }).setScrollFactor(0);
        
        // Индикатор пряток
        this.hideText = this.add.text(width / 2, 60, '', {
            fontSize: '16px',
            color: '#33ccff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Кнопка назад
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
        const door = this.add.rectangle(10 * 32, 5 * 32, 40, 40, 0xffaa00, 0.5)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(10 * 32, 5 * 32 - 20, '🚪 В ОФИС', {
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        door.on('pointerdown', () => {
            this.scene.start('OfficeScene');
        });
    }

    createSounds() {
        // Звук капающей воды
        const drop1 = this.add.circle(250, 150, 2, 0x3498db, 0.5);
        const drop2 = this.add.circle(300, 200, 2, 0x3498db, 0.5);
        
        this.tweens.add({
            targets: drop1,
            y: 200,
            alpha: 0,
            duration: 2000,
            repeat: -1,
            onRepeat: () => {
                drop1.y = 150;
                drop1.alpha = 0.5;
            }
        });
        
        this.tweens.add({
            targets: drop2,
            y: 250,
            alpha: 0,
            duration: 3000,
            repeat: -1,
            onRepeat: () => {
                drop2.y = 200;
                drop2.alpha = 0.5;
            }
        });
    }

    toggleHide(spot) {
        if (!this.isHiding) {
            // Прячемся
            this.isHiding = true;
            this.player.sprite.alpha = 0.3;
            this.hideText.setText('🕵️ В ПРЯТКАХ (нажми еще раз, чтобы выйти)');
            
            // Добавляем эффект "тишины"
            this.showMessage('🤫 Тсс... Начальник не найдет');
            
            if (window.GameState) {
                window.GameState.stress = Math.max(0, (window.GameState.stress || 0) - 10);
            }
        } else {
            // Выходим из пряток
            this.isHiding = false;
            this.player.sprite.alpha = 1;
            this.hideText.setText('');
            
            this.showMessage('🚶 Пора возвращаться');
        }
    }

    showMessage(text) {
        const width = this.cameras.main.width;
        
        const msg = this.add.text(width / 2, 100, text, {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.tweens.add({
            targets: msg,
            y: 70,
            alpha: 0,
            duration: 2000,
            onComplete: () => msg.destroy()
        });
    }

    update() {
        if (!this.player) return;
        
        // Если в прятках - не двигаемся
        if (!this.isHiding) {
            this.player.move(this.cursors);
        }
        
        this.player.update();
        
        // Обновление UI
        this.updateUI();
        
        // Обновление времени
        if (window.TimeSystem) {
            window.TimeSystem.update('ToiletScene', false);
            this.timeText.setText(window.TimeSystem.getTimeString());
        }
        
        // Проверка, не ищет ли начальник
        this.checkBossSearch();
    }

    checkBossSearch() {
        // Случайный шанс, что начальник ищет в туалете
        if (Math.random() < 0.0005 && !this.isHiding) {
            this.showMessage('👔 Начальник заглянул!');
            
            if (window.GameState) {
                window.GameState.stress = Math.min(100, (window.GameState.stress || 0) + 15);
                window.GameState.score = Math.max(0, (window.GameState.score || 0) - 20);
            }
        } else if (Math.random() < 0.0005 && this.isHiding) {
            this.showMessage('😎 Пронесло... Начальник не заметил');
            
            if (window.GameState) {
                window.GameState.stress = Math.max(0, (window.GameState.stress || 0) - 5);
            }
        }
    }

    updateUI() {
        if (window.GameState) {
            this.scoreText.setText(`🏆 ${window.GameState.score || 0}`);
            this.stressText.setText(`😫 ${Math.round(window.GameState.stress || 0)}%`);
            
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

window.ToiletScene = ToiletScene;
console.log('🚽 ToiletScene загружен');