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
        const centerX = width / 2;
        
        // Масштабируем под экран
        const scale = Math.min(width / 800, height / 600);
        const baseTileSize = 32 * scale;
        this.tileSize = baseTileSize;
        
        // 1. СОЗДАЕМ КАРТУ С МАСШТАБИРОВАНИЕМ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * baseTileSize;
                const y = row * baseTileSize;
                const tile = this.map[row][col];
                
                if (tile === 2) {
                    // Пол
                    this.add.image(x, y, 'floor').setOrigin(0).setScale(scale);
                } else if (tile === 1) {
                    // Стены
                    this.add.image(x, y, 'wall').setOrigin(0).setScale(scale);
                }
            }
        }
        
        // 2. ДОБАВЛЯЕМ ДЕКОР С МАСШТАБИРОВАНИЕМ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * baseTileSize + baseTileSize/2;
                const y = row * baseTileSize + baseTileSize/2;
                const tile = this.map[row][col];
                
                switch(tile) {
                    case 3: // Кабинка (место для пряток)
                        const cabin = this.add.rectangle(x, y, 28 * scale, 28 * scale, 0x8B4513, 0.5);
                        cabin.setData('hiding', true);
                        cabin.setInteractive({ useHandCursor: true });
                        this.hidingSpots.push(cabin);
                        
                        // Дверца кабинки
                        this.add.rectangle(x - 8 * scale, y, 4 * scale, 20 * scale, 0xCD853F);
                        break;
                        
                    case 4: // Раковина
                        this.add.ellipse(x, y, 20 * scale, 10 * scale, 0xffffff);
                        this.add.circle(x - 5 * scale, y - 5 * scale, 3 * scale, 0x3498db);
                        this.add.circle(x + 5 * scale, y - 5 * scale, 3 * scale, 0x3498db);
                        break;
                        
                    case 5: // Зеркало
                        this.add.rectangle(x, y, 20 * scale, 24 * scale, 0x87CEEB, 0.3);
                        this.add.rectangle(x, y, 18 * scale, 22 * scale, 0x000000, 0.5);
                        break;
                }
            }
        }
        
        // 3. СОЗДАЕМ ИГРОКА (центрируем на карте)
        const playerStartX = 5 * baseTileSize;
        const playerStartY = 3 * baseTileSize;
        this.player = new Player(this, playerStartX, playerStartY);
        this.player.sprite.setScale(scale);
        
        // 4. НАСТРАИВАЕМ КАМЕРУ
        this.cameras.main.setBounds(0, 0, this.map[0].length * baseTileSize, this.map.length * baseTileSize);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(2);
        
        // 5. УПРАВЛЕНИЕ
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 6. ИНТЕРФЕЙС
        this.createUI(scale);
        
        // 7. ДВЕРИ
        this.createDoors(scale);
        
        // 8. ОБРАБОТЧИК ТАЧЕЙ
        this.input.on('pointerdown', (pointer) => {
            if (!pointer.targetObject) {
                this.player.moveTo(pointer.worldX, pointer.worldY);
            }
        });
        
        // 9. ОБРАБОТЧИК ПРЯТОК
        this.hidingSpots.forEach(spot => {
            spot.on('pointerdown', () => {
                this.toggleHide(spot, scale);
            });
        });
        
        // 10. ЭФФЕКТ ТУАЛЕТА (можно спрятаться от стресса)
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.isHiding && window.GameState) {
                    window.GameState.stress = Math.max(0, (window.GameState.stress || 0) - 5);
                    this.showMessage('😮‍💨 Отдых... Стресс -5', scale);
                }
            },
            loop: true
        });
        
        // 11. НАЗВАНИЕ ЛОКАЦИИ
        this.add.text(centerX, 20 * scale, '🚽 ТУАЛЕТ', {
            fontSize: Math.floor(24 * scale) + 'px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: Math.floor(4 * scale)
        }).setOrigin(0.5).setScrollFactor(0);
        
        // 12. ЗВУКИ (визуальные) С МАСШТАБИРОВАНИЕМ
        this.createSounds(scale);
    }

    createUI(scale) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const fontSize = Math.floor(20 * scale);
        const smallFont = Math.floor(14 * scale);
        
        // Статусы
        this.scoreText = this.add.text(10 * scale, 10 * scale, `🏆 ${window.GameState?.score || 0}`, {
            fontSize: fontSize + 'px',
            color: '#f1c40f',
            stroke: '#000000',
            strokeThickness: Math.floor(2 * scale)
        }).setScrollFactor(0);
        
        this.stressText = this.add.text(10 * scale, 35 * scale, `😫 ${Math.round(window.GameState?.stress || 0)}%`, {
            fontSize: fontSize + 'px',
            color: '#2ecc71',
            stroke: '#000000',
            strokeThickness: Math.floor(2 * scale)
        }).setScrollFactor(0);
        
        // Время
        this.timeText = this.add.text(width - 100 * scale, 10 * scale, 
            window.TimeSystem?.getTimeString() || '09:00', {
            fontSize: Math.floor(24 * scale) + 'px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: Math.floor(2 * scale)
        }).setScrollFactor(0);
        
        // Индикатор пряток (адаптивный)
        this.hideText = this.add.text(centerX, 60 * scale, '', {
            fontSize: smallFont + 'px',
            color: '#33ccff',
            stroke: '#000000',
            strokeThickness: Math.floor(1 * scale)
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Кнопка назад (адаптивная)
        const btnSize = Math.floor(40 * scale);
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

    createDoors(scale) {
        const doorX = (this.map[0].length - 2) * this.tileSize;
        const doorY = (this.map.length - 2) * this.tileSize;
        
        const door = this.add.rectangle(doorX + this.tileSize/2, doorY + this.tileSize/2, 
                                       40 * scale, 40 * scale, 0xffaa00, 0.5)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(doorX + this.tileSize/2, doorY - 20 * scale, '🚪 В ОФИС', {
            fontSize: Math.floor(12 * scale) + 'px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: Math.floor(1 * scale)
        }).setOrigin(0.5);
        
        door.on('pointerdown', () => {
            this.scene.start('OfficeScene');
        });
    }

    createSounds(scale) {
        // Звук капающей воды (адаптивный)
        const drop1 = this.add.circle(6 * this.tileSize, 3 * this.tileSize, 2 * scale, 0x3498db, 0.5);
        const drop2 = this.add.circle(8 * this.tileSize, 4 * this.tileSize, 2 * scale, 0x3498db, 0.5);
        
        this.tweens.add({
            targets: drop1,
            y: drop1.y + 50 * scale,
            alpha: 0,
            duration: 2000,
            repeat: -1,
            onRepeat: () => {
                drop1.y = 3 * this.tileSize;
                drop1.alpha = 0.5;
            }
        });
        
        this.tweens.add({
            targets: drop2,
            y: drop2.y + 50 * scale,
            alpha: 0,
            duration: 3000,
            repeat: -1,
            onRepeat: () => {
                drop2.y = 4 * this.tileSize;
                drop2.alpha = 0.5;
            }
        });
    }

    toggleHide(spot, scale) {
        if (!this.isHiding) {
            // Прячемся
            this.isHiding = true;
            this.player.sprite.alpha = 0.3;
            this.hideText.setText('🕵️ В ПРЯТКАХ (нажми еще раз, чтобы выйти)');
            
            // Добавляем эффект "тишины"
            this.showMessage('🤫 Тсс... Начальник не найдет', scale);
            
            if (window.GameState) {
                window.GameState.stress = Math.max(0, (window.GameState.stress || 0) - 10);
            }
        } else {
            // Выходим из пряток
            this.isHiding = false;
            this.player.sprite.alpha = 1;
            this.hideText.setText('');
            
            this.showMessage('🚶 Пора возвращаться', scale);
        }
    }

    showMessage(text, scale = 1) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const msg = this.add.text(width / 2, height * 0.2, text, {
            fontSize: Math.floor(14 * scale) + 'px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8 * scale, y: 4 * scale }
        }).setOrigin(0.5).setScrollFactor(0);
        
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
        const scale = Math.min(this.cameras.main.width / 800, this.cameras.main.height / 600);
        
        // Случайный шанс, что начальник ищет в туалете
        if (Math.random() < 0.0005 && !this.isHiding) {
            this.showMessage('👔 Начальник заглянул!', scale);
            
            if (window.GameState) {
                window.GameState.stress = Math.min(100, (window.GameState.stress || 0) + 15);
                window.GameState.score = Math.max(0, (window.GameState.score || 0) - 20);
            }
        } else if (Math.random() < 0.0005 && this.isHiding) {
            this.showMessage('😎 Пронесло... Начальник не заметил', scale);
            
            if (window.GameState) {
                window.GameState.stress = Math.max(0, (window.GameState.stress || 0) - 5);
            }
        }
    }

    updateUI() {
        const scale = Math.min(this.cameras.main.width / 800, this.cameras.main.height / 600);
        
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