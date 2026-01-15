// 🎮 ОФИСНЫЙ РАЗГРОМ - МОБИЛЬНАЯ ВЕРСИЯ (ТОЛЬКО ТАПЫ)

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let game;
let score = 0;
let stress = 0;
let draggedObject = null;
let tapTimer = 0;
let gameStarted = false;

// ==================== СОХРАНЕНИЕ РЕЗУЛЬТАТА ====================
function saveScore() {
    const player = window.playerName || 'Игрок';
    const scores = JSON.parse(localStorage.getItem('office_rampage_scores') || '[]');
    
    scores.push({
        player: player,
        score: score,
        stress: stress,
        date: new Date().toISOString(),
        time: Date.now()
    });
    
    // Сохраняем только последние 100 результатов
    localStorage.setItem('office_rampage_scores', JSON.stringify(scores.slice(-100)));
    
    // Сохраняем лучший счёт
    const best = localStorage.getItem('office_rampage_best') || 0;
    if (score > best) {
        localStorage.setItem('office_rampage_best', score);
    }
}

// ==================== ЗАВЕРШЕНИЕ ИГРЫ ====================
function gameOver() {
    if (!gameStarted) return;
    
    gameStarted = false;
    saveScore();
    
    // Показываем результаты
    setTimeout(() => {
        if (confirm(`🏢 ИГРА ОКОНЧЕНА!\n\n🏆 Очков: ${score}\n😫 Стресс: ${stress}%\n\nХочешь сыграть ещё?`)) {
            resetGame();
        } else {
            window.returnToMenu();
        }
    }, 1000);
}

// ==================== ОБНОВЛЁННАЯ ФУНКЦИЯ LEVEL COMPLETE ====================
function levelComplete(scene) {
    console.log('🎉 Все объекты разрушены!');
    
    // Сохраняем результат
    saveScore();
    
    // Показываем победу
    const winText = scene.add.text(
        config.width / 2,
        config.height / 2,
        `🏢 ПОБЕДА!\n\n🏆 Очков: ${score}\n😫 Стресс: ${stress}%\n\n🎉 ОФИС РАЗРУШЕН!`,
        {
            fontSize: '28px',
            fill: '#f1c40f',
            stroke: '#000',
            strokeThickness: 4,
            align: 'center',
            lineSpacing: 10
        }
    ).setOrigin(0.5).setDepth(1000);
    
    // Кнопки
    const buttons = [
        { text: '🔄 ЕЩЁ РАЗ', color: 0x2ecc71, action: () => resetGame() },
        { text: '🏠 В МЕНЮ', color: 0x3498db, action: () => window.returnToMenu() }
    ];
    
    buttons.forEach((btn, i) => {
        const buttonY = config.height / 2 + 150 + (i * 80);
        const btnBg = scene.add.rectangle(config.width / 2, buttonY, 200, 60, btn.color)
            .setInteractive({ useHandCursor: true })
            .setDepth(1000);
        
        const btnText = scene.add.text(config.width / 2, buttonY, btn.text, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setDepth(1001);
        
        btnBg.on('pointerdown', btn.action);
    });
    
    // Telegram: отправляем результат
    if (window.TelegramApp?.tg?.sendData) {
        window.TelegramApp.tg.sendData(JSON.stringify({
            action: 'game_complete',
            score: score,
            stress: stress,
            player: window.playerName || 'Игрок',
            time: new Date().toISOString()
        }));
    }
}

// ==================== ОБНОВЛЁННЫЙ CREATE ====================
function create() {
    console.log('📱 Создание игровой сцены...');
    gameStarted = true;
    
    const scene = this;
    
    // Telegram имя игрока
    if (window.TelegramApp?.userName) {
        scene.add.text(20, 20, `👤 ${TelegramApp.userName}`, {
            fontSize: '18px',
            fill: '#3498db',
            stroke: '#000',
            strokeThickness: 2
        }).setScrollFactor(0).setDepth(1000);
    }
    
    // Кнопка "В меню"
    const menuBtn = scene.add.rectangle(50, config.height - 40, 80, 40, 0x34495e)
        .setInteractive({ useHandCursor: true })
        .setDepth(1000);
    
    scene.add.text(50, config.height - 40, '🏠', {
        fontSize: '20px',
        fill: '#ffffff'
    }).setOrigin(0.5).setDepth(1001);
    
    menuBtn.on('pointerdown', () => {
        if (confirm('Выйти в меню?\nТвой прогресс будет сохранён.')) {
            saveScore();
            window.returnToMenu();
        }
    });
    
    // ... остальной код создания игры (createPlayer, createObjects и т.д.)
    
    console.log('✅ Игра началась!');
}

// ==================== ЗАПУСК ИГРЫ ====================
function initializeGame() {
    console.log('🎮 Инициализация игры...');
    
    try {
        if (game) {
            game.destroy(true);
        }
        
        game = new Phaser.Game(config);
        window.game = game;
        
        console.log('✅ Игра запущена!');
        
    } catch (error) {
        console.error('❌ Ошибка запуска:', error);
        alert('Ошибка загрузки игры. Попробуйте обновить страницу.');
        window.returnToMenu();
    }
}

// Глобальная функция для запуска игры
window.initializeGame = initializeGame;

console.log('=== ЗАПУСК МОБИЛЬНОЙ ВЕРСИИ ===');

let game;
let score = 0;
let stress = 0;
let draggedObject = null;
let tapTimer = 0;

// Конфигурация для мобильных
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        activePointers: 3 // Для мультитач
    }
};

// ==================== ЗАГРУЗКА ====================
function preload() {
    console.log('📱 Создаём текстуры для мобильных...');
    
    // Простые цветные круги (для мобильных лучше яркие)
    const colors = [
        { key: 'red', color: 0xff6b6b, name: 'Принтер' },
        { key: 'blue', color: 0x4ecdc4, name: 'Компьютер' },
        { key: 'green', color: 0x1abc9c, name: 'Стул' },
        { key: 'yellow', color: 0xffd166, name: 'Стол' },
        { key: 'purple', color: 0x9b59b6, name: 'Кофемашина' },
        { key: 'orange', color: 0xe67e22, name: 'Шкаф' },
        { key: 'player', color: 0x3498db, name: 'Ты' }
    ];
    
    colors.forEach(item => {
        const g = this.add.graphics();
        
        if (item.key === 'player') {
            // Игрок - круг с улыбкой
            g.fillStyle(item.color, 1);
            g.fillCircle(40, 40, 35);
            // Глаза
            g.fillStyle(0xffffff, 1);
            g.fillCircle(30, 30, 8);
            g.fillCircle(50, 30, 8);
            // Улыбка
            g.lineStyle(4, 0xffffff, 1);
            g.beginPath();
            g.arc(40, 45, 15, 0.2, 0.8 * Math.PI);
            g.strokePath();
        } else {
            // Объекты - круги с иконками
            g.fillStyle(item.color, 1);
            g.fillCircle(40, 40, 35);
            
            // Белый круг внутри
            g.fillStyle(0xffffff, 0.3);
            g.fillCircle(40, 40, 25);
        }
        
        g.generateTexture(item.key, 80, 80);
        g.destroy();
    });
    
    // Фон - простой градиент
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2c3e50, 0x2c3e50, 0x34495e, 0x34495e, 1, 1, 0, 1);
    bg.fillRect(0, 0, 100, 100);
    bg.generateTexture('bg', 100, 100);
    bg.destroy();
}

// ==================== СОЗДАНИЕ СЦЕНЫ ====================
function create() {
    console.log('📱 Создаём мобильную сцену...');
    
    // Скрываем загрузку
    document.getElementById('loading').style.display = 'none';
    
    // Фон
    this.add.tileSprite(0, 0, config.width, config.height, 'bg')
        .setOrigin(0, 0)
        .setAlpha(0.8);
    
    // Создаём игрока (большой и заметный)
    createPlayer(this);
    
    // Создаём объекты (крупные, для тапов)
    createObjects(this);
    
    // Мобильные кнопки управления
    createMobileButtons(this);
    
    // Мобильные жесты
    setupMobileGestures(this);
    
    // UI для мобильных (крупный текст)
    createMobileUI(this);
    
    console.log('✅ Мобильная сцена готова! Тапай!');
}

function createPlayer(scene) {
    scene.player = scene.add.sprite(
        config.width * 0.5,
        config.height * 0.7,
        'player'
    );
    
    scene.player.setScale(0.8); // было 1.2
    // ... остальное
}

function createObjects(scene) {
    scene.objects = [];
    
    const objectCount = 8; // было 12
    
    for (let i = 0; i < objectCount; i++) {
        // Меньше объектов в ряду для телефона
        const gridX = (i % 3) * (config.width / 3) + (config.width / 6); // было %4
        const gridY = Math.floor(i / 3) * (config.height / 3) + (config.height / 6);
        
        // ... создание объекта
        const obj = scene.add.sprite(gridX, gridY, type);
        obj.setScale(0.6); // было 0.9
        
        // ... остальное
    }
}

function createObjects(scene) {
    scene.objects = [];
    
    // Меньше объектов, но крупнее (для мобильных)
    const objectCount = 12;
    
    for (let i = 0; i < objectCount; i++) {
        // Располагаем в сетке для удобства тапов
        const gridX = (i % 4) * (config.width / 4) + (config.width / 8);
        const gridY = Math.floor(i / 4) * (config.height / 4) + (config.height / 8);
        
        const types = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        const type = types[i % types.length];
        
        const obj = scene.add.sprite(gridX, gridY, type);
        obj.setScale(0.9);
        obj.setData('type', type);
        obj.setData('health', 100);
        obj.setData('points', 100);
        obj.setInteractive({ useHandCursor: true });
        
        // Вращение для живого вида
        scene.tweens.add({
            targets: obj,
            angle: 360,
            duration: 10000 + Math.random() * 5000,
            repeat: -1,
            ease: 'Linear'
        });
        
        scene.objects.push(obj);
    }
    
    console.log(`📱 Создано ${scene.objects.length} объектов для тапов`);
}

function createMobileButtons(scene) {
    // Делаем кнопки МЕНЬШЕ и ВЫШЕ
    const buttonHeight = 50; // было 80
    const buttonWidth = config.width / 4;
    const buttonY = config.height - 40; // было -60
    
    const buttons = [
        {
            x: buttonWidth * 0.5,
            text: '👊',
            color: 0xe74c3c,
            action: () => smashNearestObject(scene)
        },
        {
            x: buttonWidth * 1.5,
            text: '☕',
            color: 0x8B4513,
            action: () => drinkCoffee(scene)
        },
        {
            x: buttonWidth * 2.5,
            text: '😡',
            color: 0xf39c12,
            action: () => increaseStress(scene)
        },
        {
            x: buttonWidth * 3.5,
            text: '🔄',
            color: 0x2ecc71,
            action: () => resetGame()
        }
    ];
    
    buttons.forEach(btn => {
        // Меньшие кнопки
        const bg = scene.add.circle(btn.x, buttonY, 25, btn.color); // было 35
        
        // Меньший текст
        const text = scene.add.text(btn.x, buttonY, btn.text, {
            fontSize: '20px', // было 30px
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // ... остальное
    });
    
    // Убираем подпись под кнопками (на телефоне не нужно)
    // scene.add.text(config.width / 2, config.height - 10, ...)
}

function setupMobileGestures(scene) {
    console.log('👆 Настраиваем мобильные жесты...');
    
    // ТАП на объект -> взять/отпустить
    scene.input.on('pointerdown', (pointer) => {
        const target = pointer.targetGameObject;
        
        if (target && target !== scene.player) {
            // Если уже держим объект - отпускаем
            if (draggedObject === target) {
                stopDragging(scene, target, pointer);
            } 
            // Если не держим - начинаем драг
            else if (!draggedObject) {
                startDragging(scene, target, pointer);
            }
        }
        // Тап на пустое место -> двигаем игрока
        else if (!target) {
            movePlayerTo(scene, pointer.x, pointer.y);
        }
    });
    
    // ДВОЙНОЙ ТАП обработка
    scene.input.on('pointerdown', (pointer) => {
        const now = Date.now();
        const target = pointer.targetGameObject;
        
        if (now - tapTimer < 300 && target && target !== scene.player) {
            // Двойной тап -> удар
            smashObject(scene, target);
            tapTimer = 0;
        } else {
            tapTimer = now;
        }
    });
    
    // ПЕРЕТАСКИВАНИЕ
    scene.input.on('drag', (pointer, target, dragX, dragY) => {
        if (draggedObject === target) {
            target.x = dragX;
            target.y = dragY;
            
            // Эффект при быстром движении
            if (pointer.velocity.length() > 5) {
                createTrail(scene, target.x, target.y, target.texture.key);
            }
        }
    });
    
    // ОТПУСКАНИЕ (бросок)
    scene.input.on('pointerup', (pointer) => {
        if (draggedObject) {
            stopDragging(scene, draggedObject, pointer);
        }
    });
    
    // Включаем драг для всех объектов
    scene.input.setDraggable(scene.objects);
}

function createMobileUI(scene) {
    // УМЕНЬШАЕМ ВСЕ ШРИФТЫ!
    const style = {
        fontSize: '18px', // было 28px
        fill: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2 // было 4
    };
    
    // Заголовок
    scene.add.text(10, 10, '🏢 ОФИСНЫЙ РАЗГРОМ', { // был 20,20
        ...style,
        fontSize: '20px', // было 32px
        fill: '#3498db'
    }).setScrollFactor(0);
    
    // Счёт
    scene.scoreText = scene.add.text(10, 40, '🏆 0', { // был 20,70
        ...style,
        fontSize: '22px', // было 36px
        fill: '#f1c40f'
    }).setScrollFactor(0);
    
    // Стресс
    scene.stressText = scene.add.text(config.width - 80, 40, '😫 0%', { // был -120,70
        ...style,
        fontSize: '22px',
        align: 'right'
    }).setScrollFactor(0);
    
    // Инструкция (УБИРАЕМ или делаем очень маленькой)
    scene.add.text(config.width / 2, 70, // был 120
        '👆 Тапай объекты\n👆👆 Двойной тап\n📍 Тапай куда идти', {
        fontSize: '12px', // было 18px
        fill: '#bdc3c7',
        align: 'center',
        lineSpacing: 5
    }).setOrigin(0.5).setScrollFactor(0);
}
// ==================== МОБИЛЬНЫЕ ФУНКЦИИ ====================
function startDragging(scene, obj, pointer) {
    draggedObject = obj;
    
    // Визуальная обратная связь
    obj.setTint(0x888888);
    obj.setScale(obj.scale * 1.1);
    
    // Сохраняем исходное положение (для возврата если бросить рядом)
    obj.setData('startX', obj.x);
    obj.setData('startY', obj.y);
    
    console.log(`🖐️ Держим ${obj.getData('type')}`);
    
    // Вибрация (если поддерживается)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function stopDragging(scene, obj, pointer) {
    obj.clearTint();
    obj.setScale(obj.scale / 1.1);
    
    // Если бросили быстро - придаём скорость
    if (pointer.velocity.length() > 5) {
        obj.x += pointer.velocity.x * 0.3;
        obj.y += pointer.velocity.y * 0.3;
    }
    
    // Очки за действие
    score += 5;
    stress = Math.min(100, stress + 1);
    updateUI(scene);
    
    console.log(`✋ Бросили ${obj.getData('type')}`);
    draggedObject = null;
    
    // Вибрация
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

function movePlayerTo(scene, x, y) {
    console.log(`🚶 Игрок идёт к ${Math.round(x)}, ${Math.round(y)}`);
    
    // Плавное движение
    scene.tweens.add({
        targets: scene.player,
        x: x,
        y: y,
        duration: 800,
        ease: 'Back.easeOut'
    });
    
    // Следы
    createFootprint(scene, scene.player.x, scene.player.y);
    
    // Вибрация
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }
}

function smashObject(scene, obj) {
    console.log(`💥 Бьём ${obj.getData('type')} (двойной тап)`);
    
    // Анимация удара
    scene.tweens.add({
        targets: obj,
        scaleX: 1.3,
        scaleY: 0.7,
        duration: 100,
        yoyo: true
    });
    
    // Эффект удара
    const particles = scene.add.particles(obj.x, obj.y, obj.texture.key, {
        speed: { min: -80, max: 80 },
        scale: { start: 0.6, end: 0 },
        quantity: 8,
        lifespan: 600,
        blendMode: 'ADD'
    });
    
    // Очки и стресс
    const damage = 30;
    score += damage;
    stress = Math.min(100, stress + damage / 5);
    updateUI(scene);
    
    // Урон
    const health = obj.getData('health') - damage;
    obj.setData('health', health);
    
    // Если объект разрушен
    if (health <= 0) {
        destroyObject(scene, obj, particles);
    } else {
        scene.time.delayedCall(600, () => particles.destroy());
    }
    
    // Сильная вибрация
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
    }
}

function smashNearestObject(scene) {
    if (scene.objects.length === 0) return;
    
    // Находим ближайший объект к игроку
    let nearest = null;
    let minDistance = Infinity;
    
    scene.objects.forEach(obj => {
        const distance = Phaser.Math.Distance.Between(
            scene.player.x, scene.player.y,
            obj.x, obj.y
        );
        
        if (distance < minDistance && distance < 300) {
            minDistance = distance;
            nearest = obj;
        }
    });
    
    if (nearest) {
        smashObject(scene, nearest);
    } else {
        // Если ничего рядом - просто ударяем в воздух
        scene.tweens.add({
            targets: scene.player,
            scale: 1.4,
            duration: 100,
            yoyo: true
        });
        
        stress = Math.min(100, stress + 5);
        updateUI(scene);
        
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }
}

function drinkCoffee(scene) {
    console.log('☕ Пьём кофе...');
    
    // Уменьшаем стресс
    stress = Math.max(0, stress - 20);
    score += 10;
    updateUI(scene);
    
    // Эффект кофе
    scene.tweens.add({
        targets: scene.player,
        scale: 1.5,
        duration: 200,
        yoyo: true
    });
    
    // Частицы кофе
    for (let i = 0; i < 10; i++) {
        const particle = scene.add.circle(
            scene.player.x, 
            scene.player.y, 
            5, 
            0x8B4513
        );
        
        scene.tweens.add({
            targets: particle,
            x: scene.player.x + Phaser.Math.Between(-50, 50),
            y: scene.player.y + Phaser.Math.Between(-50, 50),
            alpha: 0,
            scale: 0,
            duration: 500,
            onComplete: () => particle.destroy()
        });
    }
    
    if (navigator.vibrate) {
        navigator.vibrate([30, 30, 30]);
    }
}

function increaseStress(scene) {
    console.log('😡 Кричим от ярости!');
    
    stress = Math.min(100, stress + 30);
    score += 20;
    updateUI(scene);
    
    // Эффект крика
    scene.cameras.main.shake(200, 0.01);
    
    // Красный экран на мгновение
    const redFlash = scene.add.rectangle(
        config.width / 2, 
        config.height / 2, 
        config.width, config.height, 
        0xff0000, 0.3
    );
    
    scene.tweens.add({
        targets: redFlash,
        alpha: 0,
        duration: 300,
        onComplete: () => redFlash.destroy()
    });
    
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

function destroyObject(scene, obj, particles) {
    console.log(`💀 Уничтожили ${obj.getData('type')}`);
    
    // Бонусные очки
    score += obj.getData('points');
    
    // Большой взрыв
    if (particles) {
        particles.setQuantity(20);
        scene.time.delayedCall(800, () => particles.destroy());
    }
    
    // Удаляем из массива
    scene.objects = scene.objects.filter(o => o !== obj);
    
    // Взрывная анимация
    scene.tweens.add({
        targets: obj,
        scale: 2,
        alpha: 0,
        duration: 300,
        onComplete: () => obj.destroy()
    });
    
    updateUI(scene);
    
    // Длинная вибрация
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
    
    // Если все объекты разрушены
    if (scene.objects.length === 0) {
        scene.time.delayedCall(1000, () => levelComplete(scene));
    }
}

function createTrail(scene, x, y, texture) {
    const trail = scene.add.sprite(x, y, texture);
    trail.setAlpha(0.6);
    trail.setScale(0.6);
    
    scene.tweens.add({
        targets: trail,
        alpha: 0,
        scale: 0.2,
        rotation: Math.PI * 2,
        duration: 400,
        onComplete: () => trail.destroy()
    });
}

function createFootprint(scene, x, y) {
    const footprint = scene.add.ellipse(x, y + 20, 15, 8, 0xffffff, 0.2);
    
    scene.tweens.add({
        targets: footprint,
        alpha: 0,
        width: 25,
        height: 12,
        duration: 1200,
        onComplete: () => footprint.destroy()
    });
}

function levelComplete(scene) {
    console.log('🎉 Все объекты разрушены!');
    
    // Эффект победы
    scene.cameras.main.flash(1000, 255, 255, 255, 0.5);
    scene.cameras.main.shake(500, 0.02);
    
    // Сообщение
    const winText = scene.add.text(
        config.width / 2,
        config.height / 2,
        '🏢\nОФИС РАЗГРОМЛЕН!\n🎉\n\nОчков: ' + score,
        {
            fontSize: '42px',
            fill: '#f1c40f',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center',
            lineSpacing: 20
        }
    ).setOrigin(0.5);
    
    // Кнопка "Ещё раз"
    const retryBtn = scene.add.rectangle(
        config.width / 2,
        config.height / 2 + 150,
        200, 60, 0x2ecc71
    ).setInteractive({ useHandCursor: true });
    
    const retryText = scene.add.text(
        config.width / 2,
        config.height / 2 + 150,
        '🔄 ЕЩЁ РАЗ!',
        { fontSize: '28px', fill: '#ffffff' }
    ).setOrigin(0.5);
    
    retryBtn.on('pointerdown', () => {
        winText.destroy();
        retryBtn.destroy();
        retryText.destroy();
        resetGame();
    });
    
    // Долгая вибрация победы
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
}

// ==================== UI ОБНОВЛЕНИЕ ====================
function updateUI(scene) {
    if (scene.scoreText) {
        scene.scoreText.setText('🏆 ' + score);
        
        // Анимация при изменении счёта
        scene.tweens.add({
            targets: scene.scoreText,
            scale: 1.2,
            duration: 150,
            yoyo: true
        });
    }
    
    if (scene.stressText) {
        scene.stressText.setText('😫 ' + Math.round(stress) + '%');
        
        // Меняем цвет в зависимости от стресса
        const color = stress > 80 ? 0xe74c3c : 
                     stress > 50 ? 0xf39c12 : 0x2ecc71;
        scene.stressText.setFill(Phaser.Display.Color.IntegerToColor(color).rgba);
        
        // Пульсация при высоком стрессе
        if (stress > 70) {
            scene.stressText.setScale(1 + (stress - 70) / 100);
        }
    }
}

function resetGame() {
    console.log('🔄 Начинаем заново...');
    
    score = 0;
    stress = 0;
    
    if (game && game.scene) {
        const scene = game.scene.scenes[0];
        scene.scene.restart();
    }
}

// ==================== ОБНОВЛЕНИЕ ИГРЫ ====================
function update() {
    const scene = this;
    
    // Автоматическое увеличение стресса со временем
    if (Phaser.Math.Between(1, 120) === 1) {
        stress = Math.min(100, stress + 0.5);
        updateUI(scene);
    }
    
    // Случайные события
    if (Phaser.Math.Between(1, 400) === 1 && scene.objects && scene.objects.length > 0) {
        const obj = Phaser.Math.RND.pick(scene.objects);
        const events = ['shake', 'jump', 'blink'];
        const event = Phaser.Math.RND.pick(events);
        
        switch(event) {
            case 'shake':
                scene.tweens.add({
                    targets: obj,
                    x: obj.x + Phaser.Math.Between(-15, 15),
                    duration: 100,
                    yoyo: true,
                    repeat: 2
                });
                break;
                
            case 'jump':
                scene.tweens.add({
                    targets: obj,
                    y: obj.y - 20,
                    duration: 200,
                    yoyo: true
                });
                break;
                
            case 'blink':
                const originalAlpha = obj.alpha;
                obj.setAlpha(0.3);
                scene.time.delayedCall(200, () => obj.setAlpha(originalAlpha));
                break;
        }
        
        stress = Math.min(100, stress + 2);
        updateUI(scene);
    }
}

// ==================== ЗАПУСК ИГРЫ ====================
window.addEventListener('load', () => {
    console.log('📱 Запускаем мобильную игру...');
    
    // Проверяем мобильное устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        console.warn('⚠️ Кажется, вы не на мобильном устройстве. Игра оптимизирована для тапов!');
    }
    
    try {
        game = new Phaser.Game(config);
        window.game = game;
        
        // Глобальная функция сброса
        window.resetGame = resetGame;
        
        console.log('✅ Мобильная игра запущена! Тапай!');
        
    } catch (error) {
        console.error('❌ Ошибка запуска:', error);
        
        // Покажем мобильную ошибку
        document.body.innerHTML = `
            <div style="
                padding: 30px;
                text-align: center;
                background: #1a1a2e;
                color: white;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            ">
                <h1 style="color: #e74c3c; font-size: 2em;">📱 Ой!</h1>
                <p style="font-size: 1.2em; margin: 20px 0;">Игра не запустилась</p>
                <p style="color: #95a5a6;">${error.message}</p>
                <button onclick="location.reload()" style="
                    margin-top: 30px;
                    padding: 20px 40px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 15px;
                    font-size: 1.2em;
                    cursor: pointer;
                ">
                    🔄 Попробовать снова
                </button>
            </div>
        `;
    }

});



