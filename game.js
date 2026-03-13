// Простая игра для проверки
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    scene: {
        preload: preload,
        create: create
    }
};

function preload() {
    // Создаем текстуру игрока
    const graphics = this.add.graphics();
    graphics.fillStyle(0x3498db, 1);
    graphics.fillCircle(100, 100, 50);
    graphics.generateTexture('player', 200, 200);
    graphics.destroy();
}

function create() {
    // Ставим игрока
    this.add.image(400, 300, 'player');
    
    // Текст
    this.add.text(300, 200, 'Офисный кошмар', {
        fontSize: '32px',
        color: '#ffffff'
    });
    
    this.add.text(320, 250, 'Игра запущена!', {
        fontSize: '24px',
        color: '#ffff00'
    });
}

// Запуск
new Phaser.Game(config);