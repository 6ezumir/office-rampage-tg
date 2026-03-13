// ==================== КОФЕМАШИНА ====================

class CoffeeMachine {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Создаем спрайт кофемашины
        this.sprite = scene.physics.add.sprite(x, y, 'coffee_machine');
        this.sprite.setData('coffeeLeft', 100);
        this.sprite.setData('state', 'ready'); // ready, brewing, empty
        
        // Параметры
        this.stats = {
            coffeeLeft: 100,
            maxCoffee: 100,
            brewTime: 5000, // 5 секунд
            energyBoost: 20,
            stressReduction: 10,
            usageCount: 0,
            isBrewing: false
        };
        
        // Таймер
        this.brewTimer = null;
        
        // Создаем анимацию
        this.createAnimations();
        
        // UI элементы
        this.createUI();
    }
    
    createAnimations() {
        // Анимация варки кофе
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1,
            paused: true
        });
    }
    
    createUI() {
        // Индикатор кофе (зеленый - много, желтый - средне, красный - мало)
        this.coffeeIndicator = this.scene.add.rectangle(
            this.sprite.x, 
            this.sprite.y - 30, 
            40, 5, 
            0x00ff00
        ).setOrigin(0.5);
        
        // Текст состояния
        this.statusText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y + 30,
            '☕ ГОТОВО',
            {
                fontSize: '12px',
                color: '#00ff00'
            }
        ).setOrigin(0.5);
    }
    
    // Использовать кофемашину
    use() {
        // Проверяем, есть ли кофе
        if (this.stats.coffeeLeft <= 0) {
            return {
                success: false,
                message: '☕ Кофе закончился!',
                effect: null
            };
        }
        
        // Проверяем, не варится ли уже
        if (this.stats.isBrewing) {
            return {
                success: false,
                message: '⏳ Кофе варится, подожди...',
                effect: null
            };
        }
        
        // Начинаем варить
        this.stats.isBrewing = true;
        this.sprite.setData('state', 'brewing');
        this.statusText.setText('⏳ ВАРИТСЯ...');
        this.statusText.setColor('#ffff00');
        
        // Анимация
        this.scene.tweens.getTweensOf(this.sprite)[0].resume();
        
        return {
            success: true,
            message: '☕ Кофе варится...',
            effect: null,
            brewing: true
        };
    }
    
    // Завершить варку (вызывается через таймер)
    finishBrewing() {
        this.stats.isBrewing = false;
        this.stats.coffeeLeft -= 10;
        this.stats.usageCount++;
        
        this.sprite.setData('coffeeLeft', this.stats.coffeeLeft);
        this.sprite.setData('state', 'ready');
        
        // Останавливаем анимацию
        this.scene.tweens.getTweensOf(this.sprite)[0].pause();
        
        // Обновляем UI
        this.updateUI();
        
        // Эффекты для игрока
        const effects = {
            energy: this.stats.energyBoost,
            stress: -this.stats.stressReduction
        };
        
        // Если кофе закончился
        if (this.stats.coffeeLeft <= 0) {
            this.statusText.setText('❌ ПУСТО');
            this.statusText.setColor('#ff0000');
        } else {
            this.statusText.setText('☕ ГОТОВО');
            this.statusText.setColor('#00ff00');
        }
        
        return {
            success: true,
            message: '☕ Кофе готов! Энергия +20, Стресс -10',
            effect: effects
        };
    }
    
    // Обновить UI
    updateUI() {
        // Обновляем индикатор кофе
        const percent = this.stats.coffeeLeft / this.stats.maxCoffee;
        let color;
        
        if (percent > 0.6) color = 0x00ff00;      // зеленый
        else if (percent > 0.3) color = 0xffff00; // желтый
        else color = 0xff0000;                    // красный
        
        this.coffeeIndicator.fillColor = color;
        this.coffeeIndicator.width = 40 * percent;
    }
    
    // Пополнить кофе
    refill(amount = 50) {
        this.stats.coffeeLeft = Math.min(this.stats.maxCoffee, this.stats.coffeeLeft + amount);
        this.sprite.setData('coffeeLeft', this.stats.coffeeLeft);
        this.updateUI();
        
        if (this.stats.coffeeLeft > 0 && this.sprite.getData('state') === 'empty') {
            this.sprite.setData('state', 'ready');
            this.statusText.setText('☕ ГОТОВО');
            this.statusText.setColor('#00ff00');
        }
        
        return `☕ Кофе пополнен на ${amount}%`;
    }
    
    // Получить статистику
    getStats() {
        return {
            coffeeLeft: this.stats.coffeeLeft,
            usageCount: this.stats.usageCount,
            isBrewing: this.stats.isBrewing,
            state: this.sprite.getData('state')
        };
    }
    
    // Обновление позиции UI (вызывать при движении)
    updatePosition() {
        this.coffeeIndicator.setPosition(this.sprite.x, this.sprite.y - 30);
        this.statusText.setPosition(this.sprite.x, this.sprite.y + 30);
    }
    
    // Уничтожить
    destroy() {
        this.coffeeIndicator.destroy();
        this.statusText.destroy();
        this.sprite.destroy();
    }
}

window.CoffeeMachine = CoffeeMachine;
console.log('☕ CoffeeMachine загружен');