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
        
        // 1. СОЗДАЕМ КАРТУ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * this.tileSize;
                const y = row * this.tileSize;
                const tile = this.map[row][col];
                
                if (tile === 2) {
                    // Пол
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
                    case 3: // Скамейка
                        this.add.rectangle(x, y, 28, 12, 0x8B4513).setOrigin(0.5);
                        break;
                    case 4: // Пепельница
                        this.add.circle(x, y, 8, 0x4a4a4a);
                        this.add.circle(x, y, 4, 0x2a2a2a);
                        break;
                }
            }
        }
        
        // 3. СОЗДАЕМ ИГРОКА
        this.player = new Player(this, 200, 200);
        
        // 4. СОЗДАЕМ КОЛЛЕГ (курящих)
        this.createSmokingColleagues();
        
        // 5. СОЗДАЕМ ДЫМ
        this.createSmokeEffect();
        
        // 6. НАСТРАИВАЕМ КАМЕРУ
        this.cameras.main.setBounds(0, 0, 15 * 32, 9 * 32);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(2);
        
        // 7. УПРАВЛЕНИЕ
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 8. ИНТЕРФЕЙС
        this.createUI();
        
        // 9. ДВЕРИ
        this.createDoors();
        
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
                    this.showMessage('😮‍💨 Стресс снижается...');
                }
            },
            loop: true
        });
        
        // 12. НАЗВАНИЕ ЛОКАЦИИ
        this.add.text(width / 2, 20, '🚬 КУРИЛКА', {
            fontSize: '24px',
            color: '#cccccc',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0);
    }

    createSmokingColleagues() {
        const positions = [
            { x: 200, y: 150 },
            { x: 300, y: 250 },
            { x: 150, y: 300 }
        ];
        
        positions.forEach(pos => {
            const colleague = this.add.sprite(pos.x, pos.y, 'colleague');
            colleague.setData('isSmoking', true);
            colleague.setData('talked', false);
            
            this.colleagues.push(colleague);
        });
    }

    createSmokeEffect() {
        // Создаем частицы дыма
        for(let i = 0; i < 10; i++) {
            const smoke = this.add.circle(
                200 + Math.random() * 200,
                150 + Math.random() * 200,
                2 + Math.random() * 3,
                0xcccccc,
                0.3
            );
            
            this.smokeParticles.push(smoke);
            
            // Анимация дыма
            this.tweens.add({
                targets: smoke,
                y: smoke.y - 50,
                x: smoke.x + (Math.random() - 0.5) * 30,
                alpha: 0,
                scale: 2,
                duration: 3000 + Math.random() * 2000,
                repeat: -1,
                onRepeat: (tween, target) => {
                    target.y = 150 + Math.random() * 200;
                    target.x = 200 + Math.random() * 200;
                    target.alpha = 0.3;
                    target.scale = 1;
                }
            });
        }
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
        
        // Предупреждение
        this.warningText = this.add.text(width - 150, 50, '⚠️ НАЧАЛЬНИК', {
            fontSize: '14px',
            color: '#ff0000'
        }).setScrollFactor(0).setVisible(false);
    }

    createDoors() {
        const door = this.add.rectangle(13 * 32, 7 * 32, 40, 40, 0xffaa00, 0.5)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(13 * 32, 7 * 32 - 20, '🚪 В ОФИС', {
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        door.on('pointerdown', () => {
            this.scene.start('OfficeScene');
        });
    }

    showMessage(text) {
        const width = this.cameras.main.width;
        
        const msg = this.add.text(width / 2, 100, text, {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setScrollFactor(0);
        
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
                            this.showMessage('👔 НАЧАЛЬНИК ЗАМЕТИЛ! Стресс +20, Очки -30');
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
            
            if (distance < 50 && !colleague.getData('talked')) {
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
                this.showMessage(`👤 Коллега: "${text}"`);
                
                // Немного снижаем стресс
                if (window.GateState) {
                    window.GateState.stress = Math.max(0, (window.GateState.stress || 0) - 3);
                }
                
                // Сброс через время
                this.time.delayedCall(30000, () => {
                    colleague.setData('talked', false);
                });
            }
        });
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

window.SmokingScene = SmokingScene;
console.log('🚬 SmokingScene загружен');