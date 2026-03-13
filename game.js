// Размеры экрана телефона
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    parent: 'game-container',
    backgroundColor: '#2c3e50',  // Это и есть фон на весь экран!
    scale: {
        mode: Phaser.Scale.NONE,  // Не масштабируем, берём реальные пиксели
        autoCenter: Phaser.Scale.NO_CENTER
    },
    scene: {
        preload: preload,
        create: create
    }
};

function preload() {
    // Создаём текстуру
    const graphics = this.add.graphics();
    graphics.fillStyle(0x3498db, 1);
    graphics.fillCircle(100, 100, 50);
    graphics.generateTexture('player', 200, 200);
    graphics.destroy();
}

function create() {
    // Ставим игрока по центру экрана
    this.add.image(screenWidth / 2, screenHeight / 2, 'player');
    
    // Текст
    this.add.text(screenWidth / 2 - 150, screenHeight / 2 - 100, 'Офисный кошмар', {
        fontSize: '32px',
        color: '#ffffff'
    });
    
    this.add.text(screenWidth / 2 - 120, screenHeight / 2 - 50, 'Игра запущена!', {
        fontSize: '24px',
        color: '#ffff00'
    });
}

new Phaser.Game(config);