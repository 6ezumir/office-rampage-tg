// ==================== ПРИНТЕР ====================

class Printer {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Создаем спрайт принтера
        this.sprite = scene.physics.add.sprite(x, y, 'printer');
        this.sprite.setData('state', 'idle'); // idle, printing, jammed, broken
        this.sprite.setData('health', 100);
        
        // Параметры
        this.stats = {
            health: 100,
            maxHealth: 100,
            paperCount: 50,
            maxPaper: 50,
            jamChance: 0.1, // 10% шанс замятия при печати
            isPrinting: false,
            printTimer: null,
            angerLevel: 0 // как бесит принтер
        };
        
        // Создаем UI
        this.createUI();
        
        // Звуки (пока заглушки)
        this.sounds = {
            print: null,
            jam: null,
            broken: null
        };
    }
    
    createUI() {
        // Индикатор здоровья
        this.healthBar = this.scene.add.rectangle(
            this.sprite.x,
            this.sprite.y - 25,
            40, 5,
            0x00ff00
        ).setOrigin(0.5);
        
        // Индикатор бумаги
        this.paperBar = this.scene.add.rectangle(
            this.sprite.x,
            this.sprite.y - 18,
            40, 3,
            0xffffff
        ).setOrigin(0.5);
        
        // Текст состояния
        this.statusText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y + 25,
            '🖨️ ГОТОВ',
            {
                fontSize: '10px',
                color: '#00ff00'
            }
        ).setOrigin(0.5);
        
        // Анимация "злости" (когда бесит)
        this.angerEmoji = this.scene.add.text(
            this.sprite.x - 20,
            this.sprite.y - 35,
            '',
            {
                fontSize: '16px'
            }
        ).setOrigin(0.5);
    }
    
    // Использовать принтер (начать печать)
    use() {
        // Проверяем состояние
        if (this.sprite.getData('state') === 'broken') {
            return {
                success: false,
                message: '💥 Принтер сломан! Почини сначала',
                effect: null
            };
        }
        
        if (this.sprite.getData('state') === 'jammed') {
            return {
                success: false,
                message: '📄 Замятие бумаги! Устрани проблему',
                effect: null
            };
        }
        
        if (this.stats.paperCount <= 0) {
            return {
                success: false,
                message: '📄 Нет бумаги!',
                effect: null
            };
        }
        
        if (this.stats.isPrinting) {
            return {
                success: false,
                message: '⏳ Уже печатает...',
                effect: null
            };
        }
        
        // Начинаем печать
        this.stats.isPrinting = true;
        this.sprite.setData('state', 'printing');
        this.statusText.setText('⏳ ПЕЧАТЬ...');
        this.statusText.setColor('#ffff00');
        
        // Случайное время печати (2-5 секунд)
        const printTime = 2000 + Math.random() * 3000;
        
        this.stats.printTimer = setTimeout(() => {
            this.finishPrinting();
        }, printTime);
        
        return {
            success: true,
            message: '🖨️ Принтер печатает...',
            effect: null,
            printing: true
        };
    }
    
    // Завершить печать
    finishPrinting() {
        this.stats.paperCount--;
        this.stats.isPrinting = false;
        
        // Проверяем замятие
        if (Math.random() < this.stats.jamChance) {
            this.jam();
            return;
        }
        
        // Успешная печать
        this.sprite.setData('state', 'idle');
        this.statusText.setText('🖨️ ГОТОВ');
        this.statusText.setColor('#00ff00');
        
        // Обновляем UI
        this.updateUI();
        
        // Эффекты
        const effects = {
            stress: +5, // принтер бесит
            score: +10
        };
        
        this.stats.angerLevel += 5;
        
        return {
            success: true,
            message: '✅ Печать завершена! +10 очков',
            effect: effects
        };
    }
    
    // Замятие бумаги
    jam() {
        this.sprite.setData('state', 'jammed');
        this.stats.isPrinting = false;
        this.statusText.setText('📄 ЗАМЯТИЕ!');
        this.statusText.setColor('#ff6600');
        
        // Анимация "бесит"
        this.angerEmoji.setText('💢');
        this.scene.tweens.add({
            targets: this.angerEmoji,
            alpha: 0,
            duration: 1000,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.angerEmoji.setText('');
            }
        });
        
        this.stats.angerLevel += 20;
        
        return {
            success: false,
            message: '📄 ЗАМЯТИЕ! Устрани проблему!',
            effect: {
                stress: +20
            }
        };
    }
    
    // Устранить замятие
    fixJam() {
        if (this.sprite.getData('state') !== 'jammed') {
            return {
                success: false,
                message: 'Нет замятия',
                effect: null
            };
        }
        
        this.sprite.setData('state', 'idle');
        this.statusText.setText('🖨️ ГОТОВ');
        this.statusText.setColor('#00ff00');
        
        return {
            success: true,
            message: '🔧 Замятие устранено!',
            effect: {
                stress: -10,
                score: +5
            }
        };
    }
    
    // Ударить принтер (от злости)
    hit() {
        let health = this.sprite.getData('health');
        health -= 10;
        this.sprite.setData('health', health);
        this.stats.health = health;
        
        // Анимация удара
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.2,
            scaleY: 0.8,
            duration: 100,
            yoyo: true
        });
        
        // Эффекты
        let effects = {
            stress: -15,
            score: +5
        };
        
        // Если сломали
        if (health <= 0) {
            this.break();
            effects.score = +50;
        }
        
        this.updateUI();
        
        return {
            success: true,
            message: '👊 БАМ!',
            effect: effects
        };
    }
    
    // Сломать принтер
    break() {
        this.sprite.setData('state', 'broken');
        this.sprite.setData('health', 0);
        this.stats.health = 0;
        this.statusText.setText('💥 СЛОМАН');
        this.statusText.setColor('#ff0000');
        
        // Эффект взрыва (дым)
        for (let i = 0; i < 5; i++) {
            const smoke = this.scene.add.circle(
                this.sprite.x + (Math.random() - 0.5) * 20,
                this.sprite.y + (Math.random() - 0.5) * 20,
                3,
                0x333333
            );
            
            this.scene.tweens.add({
                targets: smoke,
                x: smoke.x + (Math.random() - 0.5) * 50,
                y: smoke.y - 50,
                alpha: 0,
                scale: 2,
                duration: 1000,
                onComplete: () => smoke.destroy()
            });
        }
    }
    
    // Починить принтер
    repair() {
        if (this.sprite.getData('state') !== 'broken') {
            return {
                success: false,
                message: 'Принтер не сломан',
                effect: null
            };
        }
        
        this.sprite.setData('state', 'idle');
        this.sprite.setData('health', 100);
        this.stats.health = 100;
        this.statusText.setText('🖨️ ГОТОВ');
        this.statusText.setColor('#00ff00');
        
        return {
            success: true,
            message: '🔧 Принтер починен!',
            effect: {
                stress: -20,
                score: +20
            }
        };
    }
    
    // Добавить бумагу
    addPaper(amount = 10) {
        this.stats.paperCount = Math.min(this.stats.maxPaper, this.stats.paperCount + amount);
        this.updateUI();
        
        return `📄 Бумага добавлена: ${amount} листов`;
    }
    
    // Обновить UI
    updateUI() {
        // Здоровье
        const healthPercent = this.stats.health / this.stats.maxHealth;
        let healthColor;
        
        if (healthPercent > 0.6) healthColor = 0x00ff00;
        else if (healthPercent > 0.3) healthColor = 0xffff00;
        else healthColor = 0xff0000;
        
        this.healthBar.fillColor = healthColor;
        this.healthBar.width = 40 * healthPercent;
        
        // Бумага
        const paperPercent = this.stats.paperCount / this.stats.maxPaper;
        this.paperBar.width = 40 * paperPercent;
    }
    
    // Обновить позицию UI
    updatePosition() {
        this.healthBar.setPosition(this.sprite.x, this.sprite.y - 25);
        this.paperBar.setPosition(this.sprite.x, this.sprite.y - 18);
        this.statusText.setPosition(this.sprite.x, this.sprite.y + 25);
        this.angerEmoji.setPosition(this.sprite.x - 20, this.sprite.y - 35);
    }
    
    // Получить статистику
    getStats() {
        return {
            health: this.stats.health,
            paperCount: this.stats.paperCount,
            state: this.sprite.getData('state'),
            angerLevel: this.stats.angerLevel,
            isPrinting: this.stats.isPrinting
        };
    }
    
    // Уничтожить
    destroy() {
        if (this.stats.printTimer) {
            clearTimeout(this.stats.printTimer);
        }
        
        this.healthBar.destroy();
        this.paperBar.destroy();
        this.statusText.destroy();
        this.angerEmoji.destroy();
        this.sprite.destroy();
    }
}

window.Printer = Printer;
console.log('🖨️ Printer загружен');