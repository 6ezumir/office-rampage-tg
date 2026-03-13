// ==================== ИГРОК ====================

class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Создаем спрайт игрока
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setData('speed', 200);
        this.sprite.setData('stress', 0);
        this.sprite.setData('energy', 100);
        
        // Параметры игрока
        this.stats = {
            stress: 0,
            energy: 100,
            romance: 0,
            coffeeDrunk: 0,
            cookiesEaten: 0
        };
        
        // Инвентарь
        this.inventory = [];
        
        // Анимации
        this.createAnimations();
    }
    
    createAnimations() {
        // Пока без анимаций, потом добавим
    }
    
    // Движение с клавишами
    move(cursors) {
        const speed = this.sprite.getData('speed');
        
        // По горизонтали
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(speed);
        } else {
            this.sprite.setVelocityX(0);
        }
        
        // По вертикали
        if (cursors.up.isDown) {
            this.sprite.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            this.sprite.setVelocityY(speed);
        } else {
            this.sprite.setVelocityY(0);
        }
    }
    
    // Движение к точке (для тапов)
    moveTo(x, y) {
        this.scene.tweens.add({
            targets: this.sprite,
            x: x,
            y: y,
            duration: 1000,
            ease: 'Power2'
        });
    }
    
    // Взаимодействие с предметом
    interact(item) {
        console.log(`👆 Взаимодействие с: ${item}`);
        
        // Разные эффекты для разных предметов
        switch(item) {
            case 'coffee':
                this.stats.energy = Math.min(100, this.stats.energy + 20);
                this.stats.coffeeDrunk++;
                break;
                
            case 'cookie':
                this.stats.energy = Math.min(100, this.stats.energy + 10);
                this.stats.cookiesEaten++;
                break;
                
            case 'printer':
                this.stats.stress = Math.min(100, this.stats.stress + 15);
                break;
        }
        
        // Обновляем глобальное состояние
        if (window.GameState) {
            window.GameState.stress = this.stats.stress;
            window.GameState.energy = this.stats.energy;
        }
    }
    
    // Удар по предмету
    smash(item) {
        console.log(`💥 Удар по: ${item}`);
        this.stats.stress = Math.max(0, this.stats.stress - 10);
        
        if (window.GameState) {
            window.GameState.score += 10;
            window.GameState.stress = this.stats.stress;
        }
    }
    
    // Поговорить с коллегой
    talkTo(colleague) {
        console.log(`💬 Разговор с: ${colleague}`);
        this.stats.romance += 5;
        
        if (window.GameState) {
            window.GameState.romance = this.stats.romance;
        }
    }
    
    // Обновление состояния
    update() {
        // Стресс растет со временем
        if (Math.random() < 0.001) {
            this.stats.stress = Math.min(100, this.stats.stress + 0.1);
        }
        
        // Энергия падает
        if (Math.random() < 0.002) {
            this.stats.energy = Math.max(0, this.stats.energy - 0.1);
        }
        
        // Синхронизация с глобальным состоянием
        if (window.GameState) {
            window.GameState.stress = this.stats.stress;
            window.GameState.energy = this.stats.energy;
        }
    }
    
    // Получить позицию
    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }
}

window.Player = Player;
console.log('👤 Player загружен');