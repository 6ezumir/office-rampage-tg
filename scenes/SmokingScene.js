// ==================== КУРИЛКА ====================

class SmokingScene extends Phaser.Scene {
    constructor() {
        super('SmokingScene');
        
        // Карта курилки (0-пусто, 1-стена, 2-пол, 3-скамейка, 4-пепельница)
        this.map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,3,2,3,2,3,2,3,2,3,2,3,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,4,2,4,2,4,2,4,2,4,2,4,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,3,2,3,2,3,2,3,2,3,2,3,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.tileSize = 32;
        this.player = null;
        this.colleagues = [];
        this.smokeParticles = [];
        this.cursors = null;
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
                    case 3: // Скамейка
                        this.add.rectangle(x, y, 28 * scale, 12 * scale, 0x8B4513).setOrigin(0.5);
                        break;
                    case 4: // Пепельница
                        this.add.circle(x, y, 8 * scale, 0x4a4a4a);
                        this.add.circle(x, y, 4 * scale, 0x2a2a2a);
                        break;
                }
            }
        }
        
        // 3. СОЗДАЕМ ИГРОКА (центрируем на карте)
        const playerStartX = 5 * baseTileSize;
        const playerStartY = 4 * baseTileSize;
        this.player = new Player(this, playerStartX, playerStartY);
        this.player.sprite.setScale(scale);
        
        // 4. СОЗДАЕМ КОЛЛЕГ (курящих) С МАСШТАБИРОВАНИЕМ
        this.createSmokingColleagues(scale);
        
        // 5. СОЗДАЕМ ДЫМ С МАСШТАБИРОВАНИЕМ
        this.createSmokeEffect(scale);
        
        // 6. НАСТРАИВАЕМ КАМЕРУ
        this.cameras.main.setBounds(0, 0, this.map[0].length * baseTileSize, this.map.length * baseTileSize);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(1.5);
        
        // 7. УПРАВЛЕНИЕ
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 8. ИНТЕРФЕЙС
        this.createUI(scale);
        
        // 9. ДВЕРИ
        this.createDoors(scale);
        
        // 10. ОБРАБОТЧИК ТАЧЕЙ
        this.input.on('pointerdown', (pointer) => {
            if (!pointer.targetObject) {
                this.player.moveTo(pointer.worldX, pointer.worldY);
            }
        });
        
        // 11. ЭФФЕКТ КУРИЛКИ (стресс снижается)
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                if (window.GameState) {
                    window.GameState.stress = Math.max(0, (window.GameState.stress || 0) - 2);
                    this.showMessage('😮‍💨 Стресс снижается...', scale);
                }
            },
            loop: true
        });
        
        // 12. НАЗВАНИЕ ЛОКАЦИИ
        this.add.text(centerX, 20 * scale, '🚬 КУРИЛКА', {
            fontSize: Math.floor(24 * scale) + 'px',
            color: '#cccccc',
            stroke: '#000000',
            strokeThickness: Math.floor(4 * scale)
        }).setOrigin(0.5).setScrollFactor(0);
    }

    createSmokingColleagues(scale) {
        const positions = [
            { x: 5 * this.tileSize, y: 3 * this.tileSize },
            { x: 8 * this.tileSize, y: 5 * this.tileSize },
            { x: 3 * this.tileSize, y: 6 * this.tileSize }
        ];
        
        positions.forEach(pos => {
            const colleague = this.add.sprite(pos.x, pos.y, 'colleague');
            colleague.setScale(scale);
            colleague.setData('isSmoking', true);
            colleague.setData('talked', false);
            
            this.colleagues.push(colleague);
        });
    }

    createSmokeEffect(scale) {
        // Создаем частицы дыма с масштабированием
        for(let i = 0; i < 10; i++) {
            const smoke = this.add.circle(
                5 * this.tileSize + (Math.random() - 0.5) * 4 * this.tileSize,
                4 * this.tileSize + (Math.random() - 0.5) * 3 * this.tileSize,
                (2 + Math.random() * 3) * scale,
                0xcccccc,
                0.3
            );
            
            this.smokeParticles.push(smoke);
            
            // Анимация дыма
            this.tweens.add({
                targets: smoke,
                y: smoke.y - 50 * scale,
                x: smoke.x + (Math.random() - 0.5) * 30 * scale,
                alpha: 0,
                scale: 2 * scale,
                duration: 3000 + Math.random() * 2000,
                repeat: -1,
                onRepeat: (tween, target) => {
                    target.y = 4 * this.tileSize + (Math.random() - 0.5) * 3 * this.tileSize;
                    target.x = 5 * this.tileSize + (Math.random() - 0.5) * 4 * this.tileSize;
                    target.alpha = 0.3;
                    target.scale = scale;
                }
            });
        }
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
        
        // Предупреждение
        this.warningText = this.add.text(width - 150 * scale, 50 * scale, '⚠️ НАЧАЛЬНИК', {
            fontSize: smallFont + 'px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: Math.floor(1 * scale)
        }).setScrollFactor(0).setVisible(false);
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

    showMessage(text, scale = 1) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const msg = this.add.text(width / 2, height * 0.2, text, {
            fontSize: Math.floor(16 * scale) + 'px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10 * scale, y: 5 * scale }
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
        
        // Движение игрока
        this.player.move(this.cursors);
        this.player.update();
        
        // Обновление UI
        this.updateUI();
        
        // Обновление времени
        if (window.TimeSystem) {
            window.TimeSystem.update('SmokingScene', false);
            this.timeText.setText(window.TimeSystem.getTimeString());
        }
        
        // Проверка, не идет ли начальник
        this.checkBossComing();
        
        // Взаимодействие с коллегами
        this.checkColleagueInteraction();
    }

    checkBossComing() {
        // Случайный шанс, что начальник идет в курилку
        if (Math.random() < 0.001) {
            this.warningText.setVisible(true);
            
            // Мигание предупреждения
            this.tweens.add({
                targets: this.warningText,
                alpha: 0,
                duration: 500,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    this.warningText.setVisible(false);
                    
                    // Если игрок все еще в курилке - штраф
                    if (this.scene.isActive()) {
                        if (window.GameState) {
                            window.GameState.stress = Math.min(100, (window.GameState.stress || 0) + 20);
                            window.GameState.score = Math.max(0, (window.GameState.score || 0) - 30);
                            this.showMessage('👔 НАЧАЛЬНИК ЗАМЕТИЛ! Стресс +20, Очки -30', 
                                           Math.min(this.cameras.main.width / 800, this.cameras.main.height / 600));
                        }
                    }
                }
            });
        }
    }

    checkColleagueInteraction() {
        this.colleagues.forEach(colleague => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                colleague.x, colleague.y
            );
            
            if (distance < 50 * (this.cameras.main.width / 800) && !colleague.getData('talked')) {
                colleague.setData('talked', true);
                
                // Случайный диалог
                const dialogues = [
                    'Ну и денек...',
                    'Дай зажигалку?',
                    'Скоро обед?',
                    'Начальник бесит...',
                    'Пятница, скоро!'
                ];
                
                const text = dialogues[Math.floor(Math.random() * dialogues.length)];
                this.showMessage(`👤 Коллега: "${text}"`, 
                               Math.min(this.cameras.main.width / 800, this.cameras.main.height / 600));
                
                // Немного снижаем стресс
                if (window.GameState) {
                    window.GameState.stress = Math.max(0, (window.GameState.stress || 0) - 3);
                }
                
                // Сброс через время
                this.time.delayedCall(30000, () => {
                    colleague.setData('talked', false);
                });
            }
        });
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

window.SmokingScene = SmokingScene;
console.log('🚬 SmokingScene загружен');