// Определяем размеры экрана телефона
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Рассчитываем размер игры под экран (но сохраняем пропорции)
let gameWidth, gameHeight;

if (screenWidth / screenHeight > 800 / 600) {
    // Экран шире, чем пропорции игры
    gameHeight = screenHeight;
    gameWidth = (800 / 600) * screenHeight;
} else {
    // Экран выше, чем пропорции игры
    gameWidth = screenWidth;
    gameHeight = (600 / 800) * screenWidth;
}

const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    scene: {
        preload: preload,
        create: create
    }
};

function preload() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x3498db, 1);
    graphics.fillCircle(100, 100, 50);
    graphics.generateTexture('player', 200, 200);
    graphics.destroy();
}

function create() {
    // Ставим игрока по центру
    this.add.image(gameWidth / 2, gameHeight / 2, 'player');
    
    // Текст по центру
    this.add.text(gameWidth / 2 - 150, gameHeight / 2 - 100, 'Офисный кошмар', {
        fontSize: Math.floor(gameWidth / 20) + 'px',
        color: '#ffffff'
    });
    
    this.add.text(gameWidth / 2 - 120, gameHeight / 2 - 50, 'Игра запущена!', {
        fontSize: Math.floor(gameWidth / 25) + 'px',
        color: '#ffff00'
    });
}

new Phaser.Game(config);