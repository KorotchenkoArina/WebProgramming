// js/data.js

// Функция для безопасной работы с localStorage
const storage = {
    // Безопасное получение данных
    get: (key, defaultValue = null) => {
        try {
            // Проверяем, доступен ли localStorage
            if (typeof localStorage === 'undefined') {
                console.warn('localStorage недоступен. Используем значения по умолчанию.');
                return defaultValue;
            }
            
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            
            return JSON.parse(item);
        } catch (error) {
            console.error(`Ошибка при чтении ${key} из localStorage:`, error);
            
            // Очищаем поврежденные данные
            try {
                localStorage.removeItem(key);
            } catch (cleanupError) {
                console.error('Не удалось очистить поврежденные данные:', cleanupError);
            }
            
            return defaultValue;
        }
    },
    
    // Безопасное сохранение данных
    set: (key, value) => {
        try {
            // Проверяем, доступен ли localStorage
            if (typeof localStorage === 'undefined') {
                throw new Error('localStorage недоступен в этом браузере');
            }
            
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Ошибка при сохранении ${key} в localStorage:`, error);
            
            // Если превышена квота
            if (error.name === 'QuotaExceededError') {
                console.warn('Превышена квота localStorage. Попытка очистки старых данных...');
                
                // Попробуем очистить и снова сохранить
                try {
                    localStorage.removeItem('reviews'); // Удаляем старые отзывы
                    localStorage.setItem(key, JSON.stringify(value));
                    console.log('Данные сохранены после очистки');
                    return true;
                } catch (retryError) {
                    console.error('Не удалось сохранить даже после очистки:', retryError);
                }
            }
            
            return false;
        }
    },
    
    // Безопасное удаление
    remove: (key) => {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(key);
            }
            return true;
        } catch (error) {
            console.error(`Ошибка при удалении ${key}:`, error);
            return false;
        }
    },
    
    // Проверка доступности
    isAvailable: () => {
        try {
            return typeof localStorage !== 'undefined';
        } catch (error) {
            return false;
        }
    }
};

// Данные по умолчанию
const defaultOrderData = {
    place: 'кафе "КПСС"',
    address: 'пр. Славы 50, г. Сыктывкар',
    date: '01.03.2025',
    from: '16:00',
    to: '20:00',
    duration: '4 часа',
    luggage: '3 чемодана до 25 кг',
    price: 1220,
    payment: {
        status: 'Оплачено',
        method: 'Карта',
        bank: 'Альфа Банк',
        card: '200*************72'
    }
};

const defaultOrderHistory = [
    {
        id: 1,
        date: '28.02.2025',
        place: 'Ресторан "Белые ночи"',
        address: 'ул. Ленина 15, г. Санкт-Петербург',
        price: 1850,
        status: 'completed',
        luggage: '2 чемодана до 20 кг',
        duration: '3 часа',
        from: '14:00',
        to: '17:00'
    },
    {
        id: 2,
        date: '25.02.2025',
        place: 'Аэропорт Шереметьево',
        address: 'Терминал D, г. Москва',
        price: 3200,
        status: 'completed',
        luggage: '4 чемодана до 30 кг',
        duration: '6 часов',
        from: '08:00',
        to: '14:00'
    }
];

const defaultProfileSettings = {
    name: 'Адолат Бердиева',
    email: 'adolat@example.com',
    phone: '+7 (912) 345-67-89',
    notifications: {
        email: true,
        sms: true,
        push: false
    },
    language: 'ru',
    currency: 'RUB'
};

// Загрузка данных с обработкой ошибок
export const orderData = storage.get('orderData', defaultOrderData);
export let reviews = storage.get('reviews', []);
export let orderHistory = storage.get('orderHistory', defaultOrderHistory);
export let profileSettings = storage.get('profileSettings', defaultProfileSettings);

// Функции для сохранения данных
export const saveData = {
    saveOrderData: () => storage.set('orderData', orderData),
    saveReviews: () => storage.set('reviews', reviews),
    saveOrderHistory: () => storage.set('orderHistory', orderHistory),
    saveProfileSettings: () => storage.set('profileSettings', profileSettings),
    
    // Сохранение всех данных
    saveAll: () => {
        const results = [
            this.saveOrderData(),
            this.saveReviews(),
            this.saveOrderHistory(),
            this.saveProfileSettings()
        ];
        return results.every(result => result === true);
    }
};

// Проверка доступности хранилища при загрузке модуля
if (!storage.isAvailable()) {
    console.error('ВНИМАНИЕ: localStorage недоступен. Данные не будут сохраняться между сессиями.');
    
    // Можно показать уведомление пользователю (опционально)
    if (typeof window !== 'undefined') {
        setTimeout(() => {
            if (confirm('Ваш браузер не поддерживает сохранение данных локально. Некоторые функции могут работать некорректно. Продолжить?')) {
                console.log('Пользователь согласился работать без localStorage');
            } else {
                window.location.href = 'https://www.google.com/chrome/'; // Пример редиректа
            }
        }, 2000);
    }
}