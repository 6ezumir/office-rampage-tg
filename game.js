// Размеры экрана
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Конфигурация игры
const config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.NO_CENTER
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0,
            debug: false
        }
    },
    scene: [
        MenuScene,     // Первая сцена - меню
        MorningScene,  // Утро с будильником
        OfficeScene,   // Основной офис
        KitchenScene,  // Кухня
        SmokingScene,  // Курилка
        ToiletScene    // Туалет
    ]
};

// Запуск игры
const game = new Phaser.Game(config);