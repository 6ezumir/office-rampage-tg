// ==================== TELEGRAM MINI APP INIT ====================
console.log('🔧 Инициализация Telegram Mini App...');

const tg = window.Telegram?.WebApp;

if (tg) {
    console.log('✅ Telegram Mini App обнаружен!');
    
    // Настройки
    tg.ready();
    tg.expand();
    tg.disableVerticalSwipes();
    
    // Данные пользователя
    window.TelegramApp = {
        user: tg.initDataUnsafe?.user,
        userName: tg.initDataUnsafe?.user?.first_name || 
                 tg.initDataUnsafe?.user?.username || 
                 'Игрок',
        userId: tg.initDataUnsafe?.user?.id || Date.now(),
        tg: tg,
        platform: tg.platform || 'unknown'
    };
    
    console.log(`👤 Игрок: ${window.TelegramApp.userName}`);
    
    // Главная кнопка
    tg.MainButton.setText('📤 ПОДЕЛИТЬСЯ');
    tg.MainButton.hide();
    
    tg.MainButton.onClick(() => {
        const score = window.gameScore || 0;
        const character = window.currentCharacter || 'worker';
        
        tg.sendData(JSON.stringify({
            action: 'share_score',
            score: score,
            character: character,
            player: window.TelegramApp.userName,
            time: new Date().toISOString()
        }));
        
        tg.HapticFeedback?.impactOccurred('medium');
        tg.showAlert(`✅ Результат отправлен!\nОчков: ${score}`);
        tg.MainButton.hide();
    });
    
    // Вибрация
    window.vibrate = function(type = 'medium') {
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred(type);
        } else if (navigator.vibrate) {
            navigator.vibrate(type === 'light' ? 20 : type === 'medium' ? 50 : 100);
        }
    };
    
} else {
    console.log('⚠️ Браузерный режим');
    
    // Заглушки для браузера
    window.TelegramApp = {
        userName: 'Тестовый Игрок',
        userId: 12345,
        tg: {
            sendData: (data) => {
                console.log('Telegram sendData:', data);
                alert('✅ Результат отправлен! (тестовый режим)');
            },
            showAlert: (msg) => alert(msg),
            MainButton: {
                setText: () => {},
                show: () => {},
                hide: () => {},
                onClick: () => {}
            },
            HapticFeedback: null
        }
    };
    
    window.vibrate = function() {
        if (navigator.vibrate) navigator.vibrate(50);
    };
}

// Экспортируем
window.playerName = window.TelegramApp.userName;
