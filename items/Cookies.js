// ==================== ПЕЧЕНЬКИ ====================

class Cookies {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Создаем спрайт печенек
        this.sprite = scene.physics.add.sprite(x, y, 'cookies');
        this.sprite.setData('count', 10);
        this.sprite.setData('type', 'chocolate'); // chocolate, oatmeal, butter
        
        // Параметры
        this.stats = {
            count: 10,
            maxCount: 10,
            type: this.getRandomType(),
            energyRestore: 10,
            happinessBoost: 5,
            refreshTime: 30000, // 30 секунд на восстановление
            lastTaken: 0,
            isRefilling: false
        };
        
        // Создаем UI
        this.createUI();
        
        // Таймер восстановления
        this.refillTimer = null;
    }
    
    getRandomType() {
        const types = [
            { name: 'chocolate', emoji: '🍫', color: 0x8B4513, energy: 15, happiness: 10 },
            { name: 'oatmeal', emoji: '🌾', color: 0xD2691E, energy: 10, happiness: 5 },
            { name: 'butter', emoji: '🧈', color: 0xFFD700, energy: 12, happiness: 8 }
        ];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    createUI() {
        // Счетчик печенек
        this.countText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 25,
            '🍪 x' + this.stats.count,
            {
                fontSize: '14px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }
        ).setOrigin(0.5);
        
        // Тип печеньки
        this.typeEmoji = this.scene.add.text(
            this.sprite.x,
            this.sprite.y + 25,
            this.stats.type.emoji,
            {
                fontSize: '20px'
            }
        ).setOrigin(0.5);
        
        // Анимация "вкусно"
        this.yumEmoji = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 40,
            '',
            {
                fontSize: '16px'
            }
        ).setOrigin(0.5);
    }
    
    // Взять печеньку
    take() {
        // Проверяем, есть ли печеньки
        if (this.stats.count <= 0) {
            // Проверяем, восстанавливаются ли
            if (this.stats.isRefilling) {
                const timeLeft = Math.ceil((this.stats.refreshTime - (Date.now() - this.stats.lastTaken)) / 1000);
                return {
                    success: false,
                    message: `⏳ Печеньки восстанавливаются... ${timeLeft}с`,
                    effect: null
                };
            }
            return {
                success: false,
                message: '😢 Печеньки закончились!',
                effect: null
            };
        }
        
        // Забираем печеньку
        this.stats.count--;
        this.stats.lastTaken = Date.now();
        
        // Если печеньки закончились, запускаем восстановление
        if (this.stats.count <= 0) {
            this.startRefill();
        }
        
        // Эффекты от печеньки (зависят от типа)
        const effects = {
            energy: this.stats.type.energy,
            stress: -this.stats.type.happiness,
            happiness: this.stats.type.happiness
        };
        
        // Анимация "ням"
        this.yumEmoji.setText('😋');
        this.scene.tweens.add({
            targets: this.yumEmoji,
            y: this.sprite.y - 60,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.yumEmoji.setText('');
                this.yumEmoji.y = this.sprite.y - 40;
                this.yumEmoji.alpha = 1;
            }
        });
        
        // Обновляем UI
        this.updateUI();
        
        return {
            success: true,
            message: `🍪 Ням! ${this.stats.type.name} печенька!`,
            effect: effects,
            cookie: {
                type: this.stats.type.name,
                energy: this.stats.type.energy,
                happiness: this.stats.type.happiness
            }
        };
    }
    
    // Начать восстановление
    startRefill() {
        this.stats.isRefilling = true;
        this.countText.setText('⏳ 0');
        
        // Таймер восстановления
        this.refillTimer = setTimeout(() => {
            this.refill();
        }, this.stats.refreshTime);
        
        // Анимация ожидания
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    // Восстановить печеньки
    refill() {
        this.stats.count = this.stats.maxCount;
        this.stats.isRefilling = false;
        this.stats.type = this.getRandomType(); // Меняем тип
        
        // Останавливаем анимацию
        this.scene.tweens.killTweensOf(this.sprite);
        this.sprite.alpha = 1;
        
        // Обновляем UI
        this.typeEmoji.setText(this.stats.type.emoji);
        this.updateUI();
        
        // Эффект появления
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true
        });
    }
    
    // Украсть печеньку (рискованно)
    steal() {
        if (this.stats.count <= 0) {
            return {
                success: false,
                message: '😢 Печенек нет',
                effect: null
            };
        }
        
        // Шанс быть пойманным
        const caught = Math.random() < 0.3; // 30% шанс
        
        if (caught) {
            return {
                success: false,
                message: '👀 Тебя поймали! Стресс +20',
                effect: {
                    stress: +20,
                    energy: 0
                }
            };
        }
        
        // Успешная кража
        this.stats.count--;
        this.updateUI();
        
        return {
            success: true,
            message: '🕵️ Печенька украдена!',
            effect: {
                energy: this.stats.type.energy,
                stress: -this.stats.type.happiness
            }
        };
    }
    
    // Обновить UI
    updateUI() {
        this.countText.setText(`🍪 x${this.stats.count}`);
        
        // Меняем цвет в зависимости от количества
        if (this.stats.count > 7) {
            this.countText.setColor('#00ff00');
        } else if (this.stats.count > 3) {
            this.countText.setColor('#ffff00');
        } else {
            this.countText.setColor('#ff0000');
        }
    }
    
    // Положить печеньку (пополнить)
    add(amount = 5) {
        this.stats.count = Math.min(this.stats.maxCount, this.stats.count + amount);
        
        // Если были пусто, останавливаем восстановление
        if (this.stats.isRefilling) {
            clearTimeout(this.refillTimer);
            this.stats.isRefilling = false;
            this.scene.tweens.killTweensOf(this.sprite);
            this.sprite.alpha = 1;
        }
        
        this.updateUI();
        
        return `🍪 Добавлено ${amount} печенек`;
    }
    
    // Получить информацию о печеньках
    getInfo() {
        return {
            count: this.stats.count,
            type: this.stats.type.name,
            emoji: this.stats.type.emoji,
            energy: this.stats.type.energy,
            happiness: this.stats.type.happiness,
            isRefilling: this.stats.isRefilling,
            timeLeft: this.stats.isRefilling ? 
                Math.max(0, this.stats.refreshTime - (Date.now() - this.stats.lastTaken)) : 0
        };
    }
    
    // Обновить позицию UI
    updatePosition() {
        this.countText.setPosition(this.sprite.x, this.sprite.y - 25);
        this.typeEmoji.setPosition(this.sprite.x, this.sprite.y + 25);
        this.yumEmoji.setPosition(this.sprite.x, this.sprite.y - 40);
    }
    
    // Уничтожить
    destroy() {
        if (this.refillTimer) {
            clearTimeout(this.refillTimer);
        }
        
        this.countText.destroy();
        this.typeEmoji.destroy();
        this.yumEmoji.destroy();
        this.sprite.destroy();
    }
}

window.Cookies = Cookies;
console.log('🍪 Cookies загружен');