// js/handlers.js
import { createModal } from './ui.js';
import { orderData, reviews, orderHistory, saveData } from './data.js';

export function initChat() {
    try {
        const modal = createModal(`
            <h3>Чат с поддержкой</h3>
            <p>Здравствуйте! Чем можем помочь?</p>
            <div style="margin-top: 20px;">
                <textarea id="chatMessage" rows="3" style="width:100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" placeholder="Введите ваше сообщение..."></textarea>
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button id="sendChatBtn" style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                    Отправить
                </button>
                <button id="closeChatBtn" style="padding: 10px 20px; background-color: #ccc; color: #333; border: none; border-radius: 5px;">
                    Закрыть
                </button>
            </div>
        `);

        document.getElementById('sendChatBtn')
            ?.addEventListener('click', () => {
                try {
                    const message = document.getElementById('chatMessage').value.trim();
                    if (!message) {
                        alert('Введите сообщение');
                        return;
                    }
                    
                    if (message.length > 1000) {
                        alert('Сообщение слишком длинное (максимум 1000 символов)');
                        return;
                    }
                    
                    alert('Сообщение отправлено! Мы ответим в течение 15 минут.');
                    modal.remove();
                } catch (error) {
                    console.error('Ошибка отправки сообщения:', error);
                    alert('Не удалось отправить сообщение. Попробуйте еще раз.');
                }
            });

        document.getElementById('closeChatBtn')
            ?.addEventListener('click', () => {
                try {
                    modal.remove();
                } catch (error) {
                    console.error('Ошибка закрытия чата:', error);
                }
            });
    } catch (error) {
        console.error('Ошибка инициализации чата:', error);
        alert('Не удалось открыть чат. Пожалуйста, попробуйте позже.');
    }
}

export function initReview() {
    try {
        const modal = createModal(`
            <h3>Оставить отзыв</h3>
            <div style="margin: 20px 0;">
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px;">Оценка:</label>
                    <div style="display: flex; gap: 5px;" id="starRating">
                        ${[1, 2, 3, 4, 5].map(i => `
                            <span class="star" data-rating="${i}" style="font-size: 24px; cursor: pointer; color: #ccc;">★</span>
                        `).join('')}
                    </div>
                </div>
                <textarea id="reviewText" rows="4" style="width:100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" placeholder="Поделитесь вашими впечатлениями..." maxlength="2000"></textarea>
                <div style="font-size: 12px; color: #666; margin-top: 5px; text-align: right;">
                    <span id="charCount">0</span>/2000
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="sendReviewBtn" style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                    Отправить отзыв
                </button>
                <button id="cancelReviewBtn" style="padding: 10px 20px; background-color: #ccc; color: #333; border: none; border-radius: 5px;">
                    Отмена
                </button>
            </div>
        `);

        // Добавляем логику для звезд рейтинга
        const stars = modal.querySelectorAll('.star');
        let selectedRating = 0;
        
        try {
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    selectedRating = parseInt(star.dataset.rating);
                    stars.forEach((s, i) => {
                        s.style.color = i < selectedRating ? '#FFD700' : '#ccc';
                    });
                });
            });
        } catch (error) {
            console.error('Ошибка настройки рейтинга:', error);
        }

        // Счетчик символов
        const textarea = modal.querySelector('#reviewText');
        const charCount = modal.querySelector('#charCount');
        
        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length;
        });

        document.getElementById('sendReviewBtn')
            ?.addEventListener('click', () => {
                try {
                    const text = document.getElementById('reviewText').value.trim();

                    if (!text) {
                        alert('Введите текст отзыва');
                        return;
                    }

                    if (selectedRating === 0) {
                        alert('Пожалуйста, поставьте оценку');
                        return;
                    }

                    const review = {
                        text,
                        rating: selectedRating,
                        date: new Date().toLocaleDateString('ru-RU'),
                        orderId: orderHistory.length + 1,
                        timestamp: Date.now()
                    };

                    reviews.push(review);
                    
                    // Сохраняем с обработкой ошибок
                    const saved = saveData.saveReviews();
                    
                    if (saved) {
                        alert(`Спасибо за отзыв! Ваша оценка: ${selectedRating} звёзд`);
                    } else {
                        alert('Отзыв добавлен, но не сохранен локально. Он может пропасть после обновления страницы.');
                    }
                    
                    modal.remove();
                } catch (error) {
                    console.error('Ошибка отправки отзыва:', error);
                    alert('Не удалось отправить отзыв. Попробуйте еще раз.');
                }
            });

        document.getElementById('cancelReviewBtn')
            ?.addEventListener('click', () => {
                try {
                    modal.remove();
                } catch (error) {
                    console.error('Ошибка закрытия формы отзыва:', error);
                }
            });
    } catch (error) {
        console.error('Ошибка инициализации формы отзыва:', error);
        alert('Не удалось открыть форму отзыва.');
    }
}

export function showReceipt() {
    try {
        createModal(`
            <h3>Чек по заказу</h3>
            <div style="margin: 20px 0;">
                <p><b>Место:</b> ${orderData.place || 'Не указано'}</p>
                <p><b>Адрес:</b> ${orderData.address || 'Не указан'}</p>
                <p><b>Дата:</b> ${orderData.date || 'Не указана'}</p>
                <p><b>Время:</b> ${orderData.from || ''} - ${orderData.to || ''}</p>
                <p><b>Длительность:</b> ${orderData.duration || 'Не указана'}</p>
                <p><b>Багаж:</b> ${orderData.luggage || 'Не указан'}</p>
                <hr style="margin: 15px 0;">
                <p><b>Сумма:</b> ${orderData.price || 0} ₽</p>
                <p><b>Способ оплаты:</b> ${orderData.payment?.method || 'Не указан'}</p>
                <p><b>Банк:</b> ${orderData.payment?.bank || 'Не указан'}</p>
                <p><b>Карта:</b> ${orderData.payment?.card || 'Не указана'}</p>
                <p><b>Статус:</b> ${orderData.payment?.status || 'Неизвестен'}</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="printReceiptBtn" style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                    Печать чека
                </button>
                <button id="closeReceiptBtn" style="padding: 10px 20px; background-color: #ccc; color: #333; border: none; border-radius: 5px;">
                    Закрыть
                </button>
            </div>
        `);

        document.getElementById('printReceiptBtn')
            ?.addEventListener('click', () => {
                try {
                    window.print();
                } catch (error) {
                    console.error('Ошибка печати:', error);
                    alert('Не удалось открыть диалог печати.');
                }
            });

        document.getElementById('closeReceiptBtn')
            ?.addEventListener('click', () => {
                try {
                    document.querySelector('.modal-overlay')?.remove();
                } catch (error) {
                    console.error('Ошибка закрытия чека:', error);
                }
            });
    } catch (error) {
        console.error('Ошибка показа чека:', error);
        alert('Не удалось загрузить данные чека.');
    }
}

// Новые функции для работы с историей заказов
export function getOrderStats() {
    try {
        const totalOrders = orderHistory.length;
        const totalAmount = orderHistory.reduce((sum, order) => sum + (order.price || 0), 0);
        const averageOrder = totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0;
        
        return {
            totalOrders,
            totalAmount,
            averageOrder
        };
    } catch (error) {
        console.error('Ошибка расчета статистики заказов:', error);
        return {
            totalOrders: 0,
            totalAmount: 0,
            averageOrder: 0
        };
    }
}

// Функция для фильтрации заказов по статусу
export function filterOrdersByStatus(status) {
    try {
        return orderHistory.filter(order => order.status === status);
    } catch (error) {
        console.error('Ошибка фильтрации заказов:', error);
        return [];
    }
}

// Экспортируем функцию для обработки ошибок в других модулях
export function handleError(error, context) {
    console.error(`Ошибка в ${context}:`, error);
    
    // Можно отправить ошибку на сервер (если бы был бэкенд)
    // sendErrorToServer(error, context);
    
    // Показать пользователю понятное сообщение
    const userMessages = {
        'localStorage': 'Не удалось сохранить данные. Проверьте настройки браузера.',
        'network': 'Проблемы с подключением к интернету.',
        'default': 'Произошла ошибка. Пожалуйста, попробуйте еще раз.'
    };
    
    const message = userMessages[context] || userMessages.default;
    
    // Показываем сообщение об ошибке
    if (typeof alert !== 'undefined') {
        alert(message);
    }
    
    // Возвращаем false для удобства проверки
    return false;
}