// ==================== СИСТЕМА СОХРАНЕНИЯ ====================

const SaveSystem = {
    // Ключ для localStorage
    storageKey: 'officeRampage_save',
    
    // Сохранить игру
    save: function(gameState) {
        try {
            // Подготавливаем данные для сохранения
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                gameState: {
                    score: gameState.score || 0,
                    stress: gameState.stress || 0,
                    energy: gameState.energy || 100,
                    romance: gameState.romance || 0,
                    timeLeft: gameState.timeLeft || 480, // 8 часов в минутах
                    gameTime: gameState.gameTime || 480, // 8:00 утра
                    gameDay: gameState.gameDay || 1,
                    currentLocation: gameState.currentLocation || 'MorningScene',
                    inventory: gameState.inventory || [],
                    relationships: gameState.relationships || {},
                    achievements: gameState.achievements || [],
                    completedQuests: gameState.completedQuests || []
                }
            };
            
            // Сохраняем в localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            
            // Если есть Telegram, сохраняем и туда
            if (window.Telegram?.WebApp?.CloudStorage) {
                window.Telegram.WebApp.CloudStorage.setItem(
                    this.storageKey, 
                    JSON.stringify(saveData),
                    function(error, success) {
                        if (error) {
                            console.log('Telegram save error:', error);
                        } else {
                            console.log('✅ Telegram cloud save successful');
                        }
                    }
                );
            }
            
            console.log('✅ Игра сохранена', new Date().toLocaleTimeString());
            return true;
            
        } catch (error) {
            console.error('❌ Ошибка сохранения:', error);
            return false;
        }
    },
    
    // Загрузить игру
    load: function() {
        try {
            // Сначала пробуем загрузить из Telegram Cloud
            if (window.Telegram?.WebApp?.CloudStorage) {
                window.Telegram.WebApp.CloudStorage.getItem(
                    this.storageKey,
                    (error, value) => {
                        if (!error && value) {
                            const saveData = JSON.parse(value);
                            console.log('✅ Загружено из Telegram Cloud');
                            this._applyLoadedData(saveData);
                            return;
                        }
                        // Если в Telegram нет, пробуем localStorage
                        this._loadFromLocal();
                    }
                );
            } else {
                // Если нет Telegram Cloud, грузим из localStorage
                this._loadFromLocal();
            }
            
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
            return null;
        }
    },
    
    // Загрузка из localStorage
    _loadFromLocal: function() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const saveData = JSON.parse(saved);
                console.log('✅ Загружено из localStorage');
                return this._applyLoadedData(saveData);
            } catch (e) {
                console.error('❌ Ошибка парсинга сохранения');
                return null;
            }
        }
        console.log('ℹ️ Сохранений не найдено');
        return null;
    },
    
    // Применить загруженные данные
    _applyLoadedData: function(saveData) {
        // Проверяем версию
        if (saveData.version !== '1.0.0') {
            console.log('⚠️ Версия сохранения отличается');
        }
        
        // Обновляем глобальное состояние
        if (window.GameState) {
            Object.assign(window.GameState, saveData.gameState);
        }
        
        console.log('📊 Загружены данные:', saveData.gameState);
        return saveData.gameState;
    },
    
    // Очистить сохранение
    clear: function() {
        localStorage.removeItem(this.storageKey);
        if (window.Telegram?.WebApp?.CloudStorage) {
            window.Telegram.WebApp.CloudStorage.removeItem(this.storageKey);
        }
        console.log('🗑️ Сохранение удалено');
    },
    
    // Проверить наличие сохранения
    hasSave: function() {
        return localStorage.getItem(this.storageKey) !== null;
    },
    
    // Автосохранение
    autoSave: function(gameState) {
        // Не сохраняем слишком часто
        if (this._lastAutoSave && Date.now() - this._lastAutoSave < 30000) {
            return; // 30 секунд между автосохранениями
        }
        
        this.save(gameState);
        this._lastAutoSave = Date.now();
    },
    
    // Экспорт сохранения (для отладки)
    exportSave: function() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            console.log('📤 Экспорт сохранения:', data);
            return data;
        }
        return null;
    },
    
    // Импорт сохранения
    importSave: function(saveData) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            console.log('📥 Импорт успешен');
            return true;
        } catch (e) {
            console.error('❌ Ошибка импорта');
            return false;
        }
    }
};

// Инициализация
window.SaveSystem = SaveSystem;
console.log('💾 SaveSystem загружен');