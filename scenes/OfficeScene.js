// ==================== ОСНОВНОЙ ОФИС ====================

class OfficeScene extends Phaser.Scene {
    constructor() {
        super('OfficeScene');
        
        // Карта офиса (0-пусто, 1-стена, 2-пол, 3-стол, 4-принтер, 5-кофе, 6-печеньки)
        this.map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,3,2,3,2,3,2,3,2,2,3,2,3,2,3,2,3,2,3,2,3,2,3,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,4,2,5,2,6,2,4,2,2,5,2,6,2,4,2,5,2,6,2,4,2,5,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,3,2,3,2,3,2,3,2,2,3,2,3,2,3,2,3,2,3,2,3,2,3,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,6,2,4,2,5,2,6,2,2,4,2,5,2,6,2,4,2,5,2,6,2,4,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,3,2,3,2,3,2,3,2,2,3,2,3,2,3,2,3,2,3,2,3,2,3,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.tileSize = 32;
        this.player = null;
        this.boss = null;
        this.colleague = null;
        this.items = [];
        this.cursors = null;
    }

    preload() {
        // Текстуры создаются программно
        this.createTextures();
    }

    createTextures() {
        const graphics = this.add.graphics();
        
        // Пол
        graphics.fillStyle(0x2c3e50, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.lineStyle(1, 0x34495e, 1);
        graphics.strokeRect(0, 0, 32, 32);
        graphics.generateTexture('floor', 32, 32);
        
        // Стена
        graphics.clear();
        graphics.fillStyle(0x7f8c8d, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.lineStyle(2, 0x95a5a6, 1);
        graphics.strokeRect(0, 0, 32, 32);
        graphics.generateTexture('wall', 32, 32);
        
        // Стол
        graphics.clear();
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(4, 20, 24, 8);
        graphics.fillStyle(0xCD853F, 1);
        graphics.fillRect(8, 8, 16, 12);
        graphics.generateTexture('desk', 32, 32);
        
        // Принтер
        graphics.clear();
        graphics.fillStyle(0x4a4a4a, 1);
        graphics.fillRect(6, 10, 20, 16);
        graphics.fillStyle(0x333333, 1);
        graphics.fillRect(10, 6, 12, 8);
        graphics.generateTexture('printer', 32, 32);
        
        // Кофемашина
        graphics.clear();
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(8, 12, 16, 14);
        graphics.fillStyle(0xCD853F, 1);
        graphics.fillCircle(16, 10, 6);
        graphics.generateTexture('coffee_machine', 32, 32);
        
        // Печеньки
        graphics.clear();
        graphics.fillStyle(0xD2691E, 1);
        graphics.fillCircle(12, 12, 6);
        graphics.fillCircle(20, 12, 6);
        graphics.fillCircle(16, 18, 6);
        graphics.generateTexture('cookies', 32, 32);
        
        // Игрок
        graphics.clear();
        graphics.fillStyle(0x3498db, 1);
        graphics.fillCircle(16, 16, 12);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(12, 12, 3);
        graphics.fillCircle(20, 12, 3);
        graphics.generateTexture('player', 32, 32);
        
        // Босс
        graphics.clear();
        graphics.fillStyle(0xc0392b, 1);
        graphics.fillCircle(16, 16, 12);
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(10, 8, 12, 4);
        graphics.generateTexture('boss', 32, 32);
        
        // Коллега
        graphics.clear();
        graphics.fillStyle(0xff69b4, 1);
        graphics.fillCircle(16, 16, 12);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(12, 12, 3);
        graphics.fillCircle(20, 12, 3);
        graphics.generateTexture('colleague', 32, 32);
        
        graphics.destroy();
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
                
                // Всегда ставим пол
                this.add.image(x, y, 'floor').setOrigin(0);
                
                // Стены
                if (tile === 1) {
                    this.add.image(x, y, 'wall').setOrigin(0);
                }
            }
        }
        
        // 2. СОЗДАЕМ ИГРОКА
        this.player = new Player(this, 300, 300);
        
        // 3. СОЗДАЕМ БОССА
        this.boss = new Boss(this, 600, 400);
        
        // 4. СОЗДАЕМ КОЛЛЕГУ
        this.colleague = new Colleague(this, 200, 400);
        
        // 5. СОЗДАЕМ ПРЕДМЕТЫ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * this.tileSize + 16;
                const y = row * this.tileSize + 16;
                const tile = this.map[row][col];
                
                switch(tile) {
                    case 3: // Стол
                        this.add.image(x, y, 'desk');
                        break;
                    case 4: // Принтер
                        const printer = new Printer(this, x, y);
                        this.items.push(printer);
                        break;
                    case 5: // Кофемашина
                        const coffee = new CoffeeMachine(this, x, y);
                        this.items.push(coffee);
                        break;
                    case 6: // Печеньки
                        const cookies = new Cookies(this, x, y);
                        this.items.push(cookies);
                        break;
                }
            }
        }
        
        // 6. НАСТРАИВАЕМ КАМЕРУ
        this.cameras.main.setBounds(0, 0, 25 * 32, 13 * 32);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(2);
        
        // 7. УПРАВЛЕНИЕ
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 8. ИНТЕРФЕЙС
        this.createUI();
        
        // 9. ОБРАБОТЧИК ТАЧЕЙ
        this.input.on('pointerdown', (pointer) => {
            if (!pointer.targetObject) {
                // Движение к месту тапа
                this.player.moveTo(pointer.worldX, pointer.worldY);
            }
        });
        
        // 10. ЗАПУСКАЕМ ВРЕМЯ
        if (window.TimeSystem) {
            window.TimeSystem.resume();
        }
    }

    createUI() {
        const width = this.cameras.main.width;
        
        // Верхняя панель
        const panel = this.add.rectangle(0, 0, width, 60, 0x000000, 0.7)
            .setOrigin(0)
            .setScrollFactor(0);
        
        // Очки
        this.scoreText = this.add.text(10, 10, '🏆 0', {
            fontSize: '20px',
            color: '#f1c40f',
            stroke: '#000000',
            strokeThickness: 2
        }).setScrollFactor(0);
        
        // Стресс
        this.stressText = this.add.text(10, 35, '😫 0%', {
            fontSize: '20px',
            color: '#2ecc71',
            stroke: '#000000',
            strokeThickness: 2
        }).setScrollFactor(0);
        
        // Энергия
        this.energyText = this.add.text(150, 10, '⚡ 100%', {
            fontSize: '20px',
            color: '#f39c12',
            stroke: '#000000',
            strokeThickness: 2
        }).setScrollFactor(0);
        
        // Роман
        this.romanceText = this.add.text(150, 35, '💕 0%', {
            fontSize: '20px',
            color: '#ff69b4',
            stroke: '#000000',
            strokeThickness: 2
        }).setScrollFactor(0);
        
        // Время
        this.timeText = this.add.text(width - 100, 10, '09:00', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setScrollFactor(0);
        
        // Кнопка меню
        const menuBtn = this.add.circle(width - 30, 30, 15, 0xff3366)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);
        
        this.add.text(width - 30, 30, '🏠', {
            fontSize: '16px'
        }).setOrigin(0.5).setScrollFactor(0);
        
        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    update() {
        if (!this.player) return;
        
        // 1. ДВИЖЕНИЕ ИГРОКА
        this.player.move(this.cursors);
        this.player.update();
        
        // 2. ОБНОВЛЕНИЕ БОССА
        if (this.boss) {
            this.boss.update(this.player.x, this.player.y);
        }
        
        // 3. ОБНОВЛЕНИЕ КОЛЛЕГИ
        if (this.colleague && window.TimeSystem) {
            this.colleague.update(window.TimeSystem.state.gameTime);
        }
        
        // 4. ОБНОВЛЕНИЕ ПРЕДМЕТОВ
        this.items.forEach(item => {
            if (item.updatePosition) {
                item.updatePosition();
            }
        });
        
        // 5. ОБНОВЛЕНИЕ UI
        this.updateUI();
        
        // 6. ОБНОВЛЕНИЕ ВРЕМЕНИ
        if (window.TimeSystem) {
            window.TimeSystem.update('OfficeScene', true);
            this.timeText.setText(window.TimeSystem.getTimeString());
        }
        
        // 7. ПРОВЕРКА КОНЦА ДНЯ
        if (window.TimeSystem && !window.TimeSystem.state.isRunning) {
            this.showEndOfDay();
        }
    }

    updateUI() {
        if (window.GameState) {
            this.scoreText.setText(`🏆 ${window.GameState.score || 0}`);
            
            const stress = window.GameState.stress || 0;
            this.stressText.setText(`😫 ${Math.round(stress)}%`);
            
            // Меняем цвет стресса
            if (stress > 70) {
                this.stressText.setColor('#e74c3c');
            } else if (stress > 40) {
                this.stressText.setColor('#f39c12');
            } else {
                this.stressText.setColor('#2ecc71');
            }
            
            this.energyText.setText(`⚡ ${Math.round(window.GameState.energy || 100)}%`);
            this.romanceText.setText(`💕 ${Math.round(window.GameState.romance || 0)}%`);
        }
        
        // Обновление от коллеги
        if (this.colleague) {
            this.romanceText.setText(`💕 ${Math.round(this.colleague.stats.relationship)}%`);
        }
    }

    showEndOfDay() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const panel = this.add.rectangle(width / 2, height / 2, 400, 300, 0x000000, 0.9)
            .setScrollFactor(0);
        
        this.add.text(width / 2, height / 2 - 100, '🏁 РАБОЧИЙ ДЕНЬ ОКОНЧЕН!', {
            fontSize: '24px',
            color: '#f1c40f'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.add.text(width / 2, height / 2 - 50, `Очки: ${window.GameState?.score || 0}`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.add.text(width / 2, height / 2 - 20, `Стресс: ${Math.round(window.GameState?.stress || 0)}%`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.add.text(width / 2, height / 2 + 10, `Роман: ${Math.round(window.GameState?.romance || 0)}%`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        const againBtn = this.add.rectangle(width / 2, height / 2 + 80, 200, 40, 0x33ccff)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);
        
        this.add.text(width / 2, height / 2 + 80, '🔄 ЕЩЕ ДЕНЬ', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        againBtn.on('pointerdown', () => {
            if (window.SaveSystem) {
                window.SaveSystem.save(window.GameState);
            }
            this.scene.start('MorningScene');
        });
    }
}

window.OfficeScene = OfficeScene;
console.log('🏢 OfficeScene загружен');