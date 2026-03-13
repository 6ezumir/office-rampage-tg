// ==================== ОСНОВНОЙ ОФИС (ЭТАП 1) ====================

class OfficeScene extends Phaser.Scene {
    constructor() {
        super('OfficeScene');
        
        // Карта офиса (1-стена, 2-пол)
        this.map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.tileSize = 32;
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
        
        graphics.destroy();
    }

    create() {
        console.log('🏗️ Создаём офис (этап 1)');
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 1. СНАЧАЛА ТЕКСТУРЫ
        this.createTextures();
        
        // 2. ПОТОМ МАСШТАБ
        const scale = Math.min(width / 1024, height / 768);
        const baseTileSize = 32 * scale;
        
        // 3. РИСУЕМ КАРТУ
        for(let row = 0; row < this.map.length; row++) {
            for(let col = 0; col < this.map[row].length; col++) {
                const x = col * baseTileSize;
                const y = row * baseTileSize;
                const tile = this.map[row][col];
                
                if (tile === 2) {
                    this.add.image(x, y, 'floor').setOrigin(0).setScale(scale);
                } else if (tile === 1) {
                    this.add.image(x, y, 'wall').setOrigin(0).setScale(scale);
                }
            }
        }
        
        // 4. ВРЕМЕННЫЙ ИГРОК (просто спрайт, без класса Player)
        const playerX = 10 * baseTileSize;
        const playerY = 6 * baseTileSize;
        const tempPlayer = this.add.circle(playerX, playerY, 15 * scale, 0xff0000);
        
        // 5. ТЕКСТ
        this.add.text(width/2, 50, 'ЭТАП 1 - ПОЛ И СТЕНЫ', {
            fontSize: 24 * scale + 'px',
            color: '#ffff00'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // 6. КНОПКА НАЗАД
        const backBtn = this.add.text(50 * scale, 50 * scale, '← НАЗАД', {
            fontSize: 20 * scale + 'px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10 * scale, y: 5 * scale }
        }).setInteractive({ useHandCursor: true }).setScrollFactor(0);
        
        backBtn.on('pointerdown', () => {
            this.scene.start('MorningScene');
        });
    }
}

window.OfficeScene = OfficeScene;
console.log('🏢 OfficeScene (этап 1) загружен');