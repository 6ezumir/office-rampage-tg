// ==================== СИСТЕМА ВРЕМЕНИ ====================

const TimeSystem = {
    // Настройки времени
    config: {
        workDayStart: 9 * 60,      // 9:00
        workDayEnd: 18 * 60,        // 18:00  
        workDayLength: 9 * 60,       // 9 часов
        realTimeMinute: 20000        // 20 секунд = 1 игровая минута
    },
    
    // Текущее время
    state: {
        gameTime: 9 * 60,            // 9:00 утра
        isRunning: false
    },
    
    // Запуск времени
    init: function() {
        this.state.gameTime = 9 * 60;
        this.state.isRunning = true;
        console.log('⏰ Время запущено: 09:00');
    },
    
    // Обновление времени
    update: function() {
        if (!this.state.isRunning) return;
        
        // Каждую секунду +3 минуты игрового времени
        this.state.gameTime += 0.05; // примерно 3 минуты в секунду
        
        // Не даем выйти за пределы дня
        if (this.state.gameTime > 18 * 60) {
            this.state.gameTime = 18 * 60;
            this.state.isRunning = false;
        }
    },
    
    // Получить текущее время в формате ЧЧ:ММ
    getTimeString: function() {
        const hours = Math.floor(this.state.gameTime / 60);
        const mins = Math.floor(this.state.gameTime % 60);
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    },
    
    // Сколько осталось (в минутах)
    getTimeLeft: function() {
        return this.config.workDayEnd - this.state.gameTime;
    },
    
    // Прогресс дня (0-100%)
    getProgress: function() {
        const total = this.config.workDayLength;
        const current = this.state.gameTime - this.config.workDayStart;
        return (current / total) * 100;
    },
    
    // Пауза
    pause: function() {
        this.state.isRunning = false;
    },
    
    // Продолжить
    resume: function() {
        this.state.isRunning = true;
    }
};

window.TimeSystem = TimeSystem;
console.log('⏱️ TimeSystem готов');