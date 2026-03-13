// ==================== НАЧАЛЬНИК ====================

class Boss {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Создаем спрайт начальника
        this.sprite = scene.physics.add.sprite(x, y, 'boss');
        this.sprite.setData('anger', 0);
        this.sprite.setData('state', 'patrol'); // patrol, chase, angry
        
        // Параметры
        this.stats = {
            anger: 0,
            patrolRoute: [
                { x: 200, y: 200 },
                { x: 600, y: 200 },
                { x: 600, y: 400 },
                { x: 200, y: 400 }
            ],
            currentPatrolIndex: 0,
            speed: 100,
            detectionRange: 150,
            angerRange: 300
        };
        
        // Таймер для смены состояния
        this.stateTimer = 0;
        
        // Создаем анимацию
        this.createAnimations();
    }
    
    createAnimations() {
        // Пока без анимаций
    }
    
    // Обновление (вызывать каждый кадр)
    update(playerX, playerY) {
        // Вычисляем расстояние до игрока
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            playerX, playerY
        );
        
        // Обновляем состояние
        this.updateState(distance);
        
        // Выполняем действия в зависимости от состояния
        switch(this.sprite.getData('state')) {
            case 'patrol':
                this.patrol();
                break;
                
            case 'chase':
                this.chase(playerX, playerY);
                break;
                
            case 'angry':
                this.angry(playerX, playerY);
                break;
        }
        
        // Гнев растет, когда игрок рядом
        if (distance < this.stats.angerRange) {
            let anger = this.sprite.getData('anger');
            anger = Math.min(100, anger + 0.1);
            this.sprite.setData('anger', anger);
        } else {
            // Гнев падает, когда игрок далеко
            let anger = this.sprite.getData('anger');
            anger = Math.max(0, anger - 0.05);
            this.sprite.setData('anger', anger);
        }
    }
    
    // Обновление состояния
    updateState(distance) {
        // Если очень близко - злится
        if (distance < 100) {
            this.sprite.setData('state', 'angry');
        }
        // Если в пределах видимости - преследует
        else if (distance < this.stats.detectionRange) {
            this.sprite.setData('state', 'chase');
        }
        // Иначе патрулирует
        else {
            this.sprite.setData('state', 'patrol');
        }
    }
    
    // Патрулирование
    patrol() {
        const target = this.stats.patrolRoute[this.stats.currentPatrolIndex];
        
        // Двигаемся к цели
        const dx = target.x - this.sprite.x;
        const dy = target.y - this.sprite.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance > 5) {
            this.sprite.setVelocityX((dx / distance) * this.stats.speed);
            this.sprite.setVelocityY((dy / distance) * this.stats.speed);
        } else {
            // Достигли цели - переходим к следующей
            this.stats.currentPatrolIndex++;
            if (this.stats.currentPatrolIndex >= this.stats.patrolRoute.length) {
                this.stats.currentPatrolIndex = 0;
            }
        }
    }
    
    // Преследование игрока
    chase(playerX, playerY) {
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance > 50) {
            this.sprite.setVelocityX((dx / distance) * this.stats.speed * 1.5);
            this.sprite.setVelocityY((dy / distance) * this.stats.speed * 1.5);
        } else {
            this.sprite.setVelocity(0, 0);
        }
    }
    
    // Злой начальник (убегаем!)
    angry(playerX, playerY) {
        // Убегает от игрока? Или наоборот - бежит за ним?
        // Пока сделаем - бежит за игроком очень быстро
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance > 20) {
            this.sprite.setVelocityX((dx / distance) * this.stats.speed * 2);
            this.sprite.setVelocityY((dy / distance) * this.stats.speed * 2);
        }
        
        // Если злой, повышает стресс игрока
        if (window.GameState && distance < 100) {
            window.GameState.stress = Math.min(100, window.GameState.stress + 0.2);
        }
    }
    
    // Получить уровень гнева
    getAngerLevel() {
        return this.sprite.getData('anger');
    }
    
    // Получить состояние
    getState() {
        return this.sprite.getData('state');
    }
    
    // Визуализация (для отладки)
    drawDebug(graphics) {
        graphics.lineStyle(2, 0xff0000, 0.5);
        graphics.strokeCircle(this.sprite.x, this.sprite.y, this.stats.detectionRange);
        
        graphics.lineStyle(2, 0xff6600, 0.5);
        graphics.strokeCircle(this.sprite.x, this.sprite.y, this.stats.angerRange);
    }
}

window.Boss = Boss;
console.log('👔 Boss загружен');