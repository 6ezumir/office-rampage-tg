class OfficeScene extends Phaser.Scene {
    constructor() {
        super('OfficeScene');
    }

    create() {
        console.log('✅ OfficeScene загружена!');
        
        // Просто текст по центру
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        this.add.text(width/2, height/2, 'ОФИС РАБОТАЕТ!', {
            fontSize: '32px',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        // Кнопка назад
        const backBtn = this.add.text(50, 50, '← Назад', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerdown', () => {
            this.scene.start('MorningScene');
        });
    }
}

window.OfficeScene = OfficeScene;
console.log('OfficeScene загружен');