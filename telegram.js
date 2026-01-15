// Telegram Mini App инициализация
console.log('🔧 Загрузка Telegram Mini App...');

const tg = window.Telegram?.WebApp;

if (tg) {
    console.log('✅ Telegram Mini App обнаружен!');
    
    // Настройки для Telegram
    tg.ready();
    tg.expand(); // Полный экран
    
    // Сохраняем данные пользователя
    window.TelegramApp = {
        user: tg.initDataUnsafe?.user,
        userName: tg.initDataUnsafe?.user?.first_name || 'Офисный Герой',
        userId: tg.initDataUnsafe?.user?.id || Date.now(),
        tg: tg,
        platform: tg.platform || 'unknown'
    };
    
    console.log(`👤 Игрок Telegram: ${window.TelegramApp.userName}`);
    
    // Настройка кнопки
    tg.MainButton.setText('🎮 ПОДЕЛИТЬСЯ РЕЗУЛЬТАТОМ');
    tg.MainButton.hide();
    
    tg.MainButton.onClick(() => {
        const score = window.gameScore || 0;
        const stress = window.gameStress || 0;
        
        tg.sendData(JSON.stringify({
            action: 'share_score',
            score: score,
            stress: stress,
            player: window.TelegramApp.userName,
            time: new Date().toISOString()
        }));
        
        tg.showAlert(`✅ Результат отправлен!\n${score} очков`);
    });
    
    // Вибрация
    window.vibrate = function(type = 'medium') {
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred(type);
        }
    };
    
} else {
    console.log('⚠️ Браузерный режим');
    
    // Заглушки для браузера
    window.TelegramApp = {
        userName: 'Тестовый Игрок',
        tg: {
            sendData: (data) => console.log('Telegram sendData:', data),
            showAlert: (msg) => alert('Telegram: ' + msg),
            MainButton: {
                setText: () => {},
                show: () => {},
                hide: () => {},
                onClick: () => {}
            }
        }
    };
    
    window.vibrate = function() {
        if (navigator.vibrate) navigator.vibrate(50);
    };
}
