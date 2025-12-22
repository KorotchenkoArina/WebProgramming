// js/main.js
import { initChat, initReview, showReceipt, handleError } from './handlers.js';

// Глобальный обработчик ошибок
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
    
    // Можно отправить ошибку на сервер мониторинга
    // sendErrorToMonitoring(event.error);
    
    // Показать пользователю, но не для всех ошибок
    if (event.error && event.error.message && 
        !event.error.message.includes('Script error')) {
        alert('Произошла ошибка в приложении. Пожалуйста, обновите страницу.');
    }
    
    // Предотвращаем стандартное поведение браузера
    event.preventDefault();
});

// Обработка необработанных promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Необработанное отклонение промиса:', event.reason);
    event.preventDefault();
});

// Основная инициализация
function initializeApp() {
    try {
        document.addEventListener('DOMContentLoaded', () => {
            try {
                // Проверяем существование элементов перед добавлением обработчиков
                const chatBtn = document.getElementById('chatBtn');
                const reviewBtn = document.getElementById('reviewBtn');
                const receiptBtn = document.getElementById('receiptBtn');
                const backButton = document.querySelector('.back a');
                
                // Добавляем обработчики только если элементы существуют
                if (chatBtn) {
                    chatBtn.addEventListener('click', (e) => {
                        try {
                            initChat();
                        } catch (error) {
                            handleError(error, 'chat initialization');
                            e.preventDefault();
                        }
                    });
                }
                
                if (reviewBtn) {
                    reviewBtn.addEventListener('click', (e) => {
                        try {
                            initReview();
                        } catch (error) {
                            handleError(error, 'review initialization');
                            e.preventDefault();
                        }
                    });
                }
                
                if (receiptBtn) {
                    receiptBtn.addEventListener('click', (e) => {
                        try {
                            showReceipt();
                        } catch (error) {
                            handleError(error, 'receipt initialization');
                            e.preventDefault();
                        }
                    });
                }
                
                if (backButton) {
                    backButton.addEventListener('click', (e) => {
                        try {
                            e.preventDefault();
                            window.history.back();
                        } catch (error) {
                            console.error('Ошибка навигации назад:', error);
                            // Если history.back не работает, переходим на главную
                            window.location.href = 'index.html';
                        }
                    });
                }
                
                // Проверяем доступность основных функций
                if (!window.localStorage) {
                    console.warn('localStorage недоступен');
                    showStorageWarning();
                }
                
            } catch (error) {
                console.error('Ошибка при загрузке DOM:', error);
                handleError(error, 'DOM initialization');
            }
        });
        
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        handleError(error, 'app initialization');
    }
}

// Функция показа предупреждения о localStorage
function showStorageWarning() {
    try {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ff9800;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            text-align: center;
            max-width: 80%;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        warning.innerHTML = `
            <strong>Внимание!</strong> 
            Ваш браузер не поддерживает сохранение данных. 
            Некоторые функции могут работать некорректно.
            <button id="closeWarning" style="margin-left: 10px; background: none; border: 1px solid white; color: white; border-radius: 3px; padding: 2px 8px; cursor: pointer;">
                ×
            </button>
        `;
        
        document.body.appendChild(warning);
        
        document.getElementById('closeWarning').addEventListener('click', () => {
            warning.remove();
        });
        
        // Автоматически скрыть через 10 секунд
        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove();
            }
        }, 10000);
    } catch (error) {
        console.error('Ошибка показа предупреждения:', error);
    }
}

// Запускаем приложение
initializeApp();

// Экспортируем для тестирования
export { initializeApp, showStorageWarning };