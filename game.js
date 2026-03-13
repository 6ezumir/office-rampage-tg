// Размеры экрана
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Для Honor X9a (2400x1080) делаем особую настройку
const isHonor = screenWidth === 1080 && screenHeight === 2400;

const config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.NO_CENTER
    },
    scene: [MenuScene, MorningScene, OfficeScene, KitchenScene, SmokingScene, ToiletScene]
};

// Функция для корректировки позиций под экран
function adaptToScreen(x, y) {
    return {
        x: (x / 800) * screenWidth,
        y: (y / 600) * screenHeight
    };
}

window.addEventListener('load', () => {
    console.log('Запуск игры на', screenWidth, 'x', screenHeight);
    new Phaser.Game(config);
});