// ==================== КОЛЛЕГА (РОМАНТИЧЕСКИЙ ИНТЕРЕС) ====================

class Colleague {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Создаем спрайт коллеги
        this.sprite = scene.physics.add.sprite(x, y, 'colleague');
        this.sprite.setData('mood', 'neutral'); // neutral, happy, sad, flirty
        this.sprite.setData('relationship', 0); // 0-100
        
        // Параметры
        this.stats = {
            name: this.getRandomName(),
            mood: 'neutral',
            relationship: 0,
            conversations: 0,
            gifts: 0,
            secretMeetings: 0,
            schedule: this.generateSchedule(),
            currentActivity: 'working',
            favoriteSpot: { x: x, y: y }
        };
        
        // Диалоги
        this.dialogues = {
            neutral: [
                "Привет! Как работа?",
                "Устал? Я тоже...",
                "Кофе будешь?",
                "Начальник сегодня злой",
                "Скорей бы домой"
            ],
            happy: [
                "Отличный день!",
                "Спасибо за помощь!",
                "Ты классный коллега",
                "Пойдем на обед?",
                "У тебя хорошее настроение?"
            ],
            flirty: [
                "Ты сегодня отлично выглядишь",
                "Может, поужинаем после работы?",
                "Ты мне нравишься...",
                "Думаю о тебе весь день",
                "Начальник не видит, можно пошептаться"
            ],
            sad: [
                "Грустно что-то...",
                "День не задался",
                "Начальник наругал",
                "Обними меня...",
                "Поговори со мной"
            ]
        };
        
        // Таймеры
        this.lastInteraction = 0;
        this.interactionCooldown = 60000; // 1 минута
        
        // Создаем анимацию
        this.createAnimations();
    }
    
    getRandomName() {
        const names = ['Аня', 'Маша', 'Катя', 'Лена', 'Оля', 'Настя', 'Юля', 'Таня'];
        return names[Math.floor(Math.random() * names.length)];
    }
    
    createAnimations() {
        // Пока без анимаций
    }
    
    generateSchedule() {
        // Расписание на день
        return [
            { time: 9 * 60, activity: 'working', x: 300, y: 200 },  // 9:00 - работа
            { time: 10 * 60, activity: 'coffee', x: 400, y: 300 },  // 10:00 - кофе
            { time: 11 * 60, activity: 'working', x: 300, y: 200 }, // 11:00 - работа
            { time: 13 * 60, activity: 'lunch', x: 500, y: 400 },   // 13:00 - обед
            { time: 14 * 60, activity: 'working', x: 300, y: 200 }, // 14:00 - работа
            { time: 16 * 60, activity: 'smoke', x: 200, y: 500 },   // 16:00 - перекур
            { time: 17 * 60, activity: 'working', x: 300, y: 200 }, // 17:00 - работа
        ];
    }
    
    // Обновление (вызывать каждый кадр)
    update(currentTime) {
        // Проверяем расписание
        this.checkSchedule(currentTime);
        
        // Меняем настроение в зависимости от отношений
        this.updateMood();
        
        // Если долго не общались - настроение падает
        if (Date.now() - this.lastInteraction > 3600000) { // 1 час
            this.stats.relationship = Math.max(0, this.stats.relationship - 0.1);
        }
    }
    
    // Проверка расписания
    checkSchedule(currentTime) {
        for (let item of this.stats.schedule) {
            if (Math.abs(currentTime - item.time) < 5) { // +/- 5 минут
                this.stats.currentActivity = item.activity;
                this.moveTo(item.x, item.y);
                break;
            }
        }
    }
    
    // Перемещение к точке
    moveTo(x, y) {
        this.scene.tweens.add({
            targets: this.sprite,
            x: x,
            y: y,
            duration: 3000,
            ease: 'Power2'
        });
    }
    
    // Обновление настроения
    updateMood() {
        const rel = this.stats.relationship;
        
        if (rel > 80) {
            this.sprite.setData('mood', 'flirty');
        } else if (rel > 50) {
            this.sprite.setData('mood', 'happy');
        } else if (rel < 20) {
            this.sprite.setData('mood', 'sad');
        } else {
            this.sprite.setData('mood', 'neutral');
        }
        
        this.stats.mood = this.sprite.getData('mood');
    }
    
    // Разговор с игроком
    talk() {
        // Проверка кулдауна
        if (Date.now() - this.lastInteraction < this.interactionCooldown) {
            return { text: "Подожди немного, дай отдохнуть...", effect: 0 };
        }
        
        this.lastInteraction = Date.now();
        this.stats.conversations++;
        
        // Выбираем диалог в зависимости от настроения
        const mood = this.sprite.getData('mood');
        const dialogues = this.dialogues[mood] || this.dialogues.neutral;
        const dialog = dialogues[Math.floor(Math.random() * dialogues.length)];
        
        // Эффект от разговора
        let effect = 0;
        let relationshipChange = 0;
        
        switch(mood) {
            case 'flirty':
                effect = 5;
                relationshipChange = 3;
                break;
            case 'happy':
                effect = 3;
                relationshipChange = 2;
                break;
            case 'neutral':
                effect = 2;
                relationshipChange = 1;
                break;
            case 'sad':
                effect = 1;
                relationshipChange = 0.5;
                break;
        }
        
        // Увеличиваем отношения
        this.stats.relationship = Math.min(100, this.stats.relationship + relationshipChange);
        this.sprite.setData('relationship', this.stats.relationship);
        
        // Обновляем глобальное состояние
        if (window.GameState) {
            window.GameState.romance = this.stats.relationship;
            window.GameState.romanceStats.conversations++;
        }
        
        return {
            text: dialog,
            effect: effect,
            relationship: this.stats.relationship
        };
    }
    
    // Подарок
    giveGift(gift) {
        this.stats.gifts++;
        
        // Разные подарки дают разный эффект
        let effect = 0;
        switch(gift) {
            case 'coffee':
                effect = 5;
                break;
            case 'cookie':
                effect = 3;
                break;
            case 'flower':
                effect = 10;
                break;
            default:
                effect = 2;
        }
        
        this.stats.relationship = Math.min(100, this.stats.relationship + effect);
        this.sprite.setData('relationship', this.stats.relationship);
        
        // Меняем настроение
        this.sprite.setData('mood', 'happy');
        
        if (window.GameState) {
            window.GameState.romance = this.stats.relationship;
            window.GameState.romanceStats.gifts++;
        }
        
        return `Спасибо за ${gift}! Отношения +${effect}`;
    }
    
    // Тайная встреча (рискованно, но эффективно)
    secretMeeting() {
        if (this.stats.relationship < 50) {
            return { text: "Еще рано для тайных встреч...", success: false };
        }
        
        this.stats.secretMeetings++;
        this.stats.relationship = Math.min(100, this.stats.relationship + 15);
        
        // Риск быть замеченным начальником
        const risk = Math.random() < 0.3; // 30% шанс
        
        if (window.GameState) {
            window.GameState.romanceStats.secretMeetings++;
        }
        
        return {
            text: risk ? "Ой! Нас чуть не заметил начальник!" : "Отлично провели время!",
            success: true,
            risk: risk
        };
    }
    
    // Получить статус отношений
    getRelationshipStatus() {
        const rel = this.stats.relationship;
        if (rel >= 90) return "💕 Влюблены";
        if (rel >= 70) return "💖 Очень близки";
        if (rel >= 50) return "💗 Хорошие друзья";
        if (rel >= 30) return "💓 Друзья";
        if (rel >= 10) return "💛 Знакомы";
        return "🤍 Коллеги";
    }
    
    // Визуализация (для отладки)
    drawDebug(graphics) {
        // Рисуем сердечко над головой в зависимости от отношений
        if (this.stats.relationship > 50) {
            graphics.fillStyle(0xff3366, 0.5);
            graphics.fillCircle(this.sprite.x, this.sprite.y - 30, 10);
        }
    }
}

window.Colleague = Colleague;
console.log('💕 Colleague загружен');