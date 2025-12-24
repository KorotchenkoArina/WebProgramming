// js/orderHistoryMain.js
import { orderHistory, saveData } from './data.js';
import { createModal } from './ui.js';
import errorHandler from './error-handler.js'; // Импортируем обработчик ошибок

// Инициализируем обработчик ошибок
errorHandler.init();

document.addEventListener('DOMContentLoaded', () => {
    try {
        renderOrders();
        updateStats();
        
        // Логируем загрузку страницы
        errorHandler.createUserError('Страница истории заказов загружена', 
            { orderCount: orderHistory.length }, 'low');
            
    } catch (error) {
        console.error('Ошибка загрузки страницы истории заказов:', error);
        errorHandler.createUserError('Ошибка загрузки истории заказов', 
            { error: error.message }, 'critical');
        
        showErrorUI();
    }
});

function renderOrders() {
    const container = document.getElementById('ordersContainer');
    
    if (!container) {
        errorHandler.createUserError('Контейнер заказов не найден', {}, 'medium');
        return;
    }
    
    try {
        if (!orderHistory || orderHistory.length === 0) {
            container.innerHTML = `
                <div class="box" style="text-align: center; padding: 40px;">
                    <p class="medium_letters">У вас пока нет заказов</p>
                    <a href="index.html" style="color: #743050; text-decoration: underline;">Вернуться к бронированию</a>
                </div>
            `;
            return;
        }
        
        // Проверяем, что orderHistory - массив
        if (!Array.isArray(orderHistory)) {
            throw new Error('orderHistory не является массивом');
        }
        
        container.innerHTML = orderHistory.map(order => {
            // Проверяем структуру каждого заказа
            if (!order || typeof order !== 'object') {
                errorHandler.createUserError('Некорректный объект заказа', { order }, 'low');
                return '';
            }
            
            return `
                <div class="order-card" data-id="${order.id || ''}">
                    <div class="order-header">
                        <div>
                            <p class="medium_large_letters">${order.place || 'Место не указано'}</p>
                            <p class="small_letters">${order.address || 'Адрес не указан'}</p>
                        </div>
                        <div class="order-status status-${order.status || 'unknown'}">
                            ${getStatusText(order.status)}
                        </div>
                    </div>
                    
                    <div class="order-details">
                        <div class="detail-item">
                            <span class="detail-label">Дата</span>
                            <span class="detail-value">${order.date || 'Не указана'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Время</span>
                            <span class="detail-value">${order.from || '--:--'} - ${order.to || '--:--'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Багаж</span>
                            <span class="detail-value">${order.luggage || 'Не указан'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Стоимость</span>
                            <span class="detail-value">${order.price || 0} ₽</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <button class="show-details-btn" data-id="${order.id || ''}" 
                                style="padding: 8px 20px; font-size: 14px;">
                            Подробнее
                        </button>
                        <button class="repeat-order-btn" data-id="${order.id || ''}" 
                                style="padding: 8px 20px; font-size: 14px; background-color: #743050; color: white;">
                            Повторить заказ
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Проверяем, есть ли элементы после рендеринга
        if (container.children.length === 0) {
            errorHandler.createUserError('Заказы не отрендерены', { orderHistory }, 'medium');
        }
        
        // Добавляем обработчики событий
        addEventListeners();
        
    } catch (error) {
        console.error('Ошибка рендеринга заказов:', error);
        errorHandler.createUserError('Ошибка отображения заказов', 
            { error: error.message, orderHistory }, 'critical');
        
        container.innerHTML = `
            <div class="box" style="text-align: center; padding: 40px; background-color: #ffebee;">
                <p class="medium_letters" style="color: #c62828;">Ошибка загрузки заказов</p>
                <p class="small_letters">Пожалуйста, попробуйте обновить страницу</p>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                    Обновить страницу
                </button>
            </div>
        `;
    }
}

function addEventListeners() {
    try {
        document.querySelectorAll('.show-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                try {
                    const orderId = parseInt(e.target.dataset.id);
                    if (isNaN(orderId)) {
                        throw new Error('Некорректный ID заказа');
                    }
                    showOrderDetails(orderId);
                } catch (error) {
                    console.error('Ошибка показа деталей заказа:', error);
                    errorHandler.createUserError('Ошибка открытия деталей заказа', 
                        { error: error.message, dataset: e.target.dataset }, 'medium');
                    alert('Не удалось открыть детали заказа');
                }
            });
        });
        
        document.querySelectorAll('.repeat-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                try {
                    const orderId = parseInt(e.target.dataset.id);
                    if (isNaN(orderId)) {
                        throw new Error('Некорректный ID заказа');
                    }
                    repeatOrder(orderId);
                } catch (error) {
                    console.error('Ошибка повторения заказа:', error);
                    errorHandler.createUserError('Ошибка повторения заказа', 
                        { error: error.message }, 'medium');
                    alert('Не удалось повторить заказ');
                }
            });
        });
    } catch (error) {
        console.error('Ошибка добавления обработчиков событий:', error);
        errorHandler.createUserError('Ошибка настройки обработчиков событий', 
            { error: error.message }, 'critical');
    }
}

function getStatusText(status) {
    const statusMap = {
        'completed': 'Завершен',
        'active': 'Активен',
        'cancelled': 'Отменен',
        'unknown': 'Неизвестен'
    };
    return statusMap[status] || status || 'Неизвестен';
}

function showOrderDetails(orderId) {
    try {
        const order = orderHistory.find(o => o.id === orderId);
        if (!order) {
            throw new Error(`Заказ с ID ${orderId} не найден`);
        }
        
        createModal(`
            <h3>Детали заказа #${order.id || 'N/A'}</h3>
            <div style="margin: 20px 0;">
                <p><strong>Место:</strong> ${order.place || 'Не указано'}</p>
                <p><strong>Адрес:</strong> ${order.address || 'Не указан'}</p>
                <p><strong>Дата:</strong> ${order.date || 'Не указана'}</p>
                <p><strong>Время:</strong> ${order.from || '--:--'} - ${order.to || '--:--'} (${order.duration || 'Не указана'})</p>
                <p><strong>Багаж:</strong> ${order.luggage || 'Не указан'}</p>
                <p><strong>Стоимость:</strong> ${order.price || 0} ₽</p>
                <p><strong>Статус:</strong> ${getStatusText(order.status)}</p>
            </div>
            <button id="closeDetailsBtn" style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                Закрыть
            </button>
        `);
        
        const closeBtn = document.getElementById('closeDetailsBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.querySelector('.modal-overlay')?.remove();
            });
        } else {
            errorHandler.createUserError('Кнопка закрытия не найдена в модальном окне', 
                { orderId }, 'low');
        }
        
    } catch (error) {
        console.error('Ошибка показа деталей заказа:', error);
        errorHandler.createUserError('Ошибка отображения деталей заказа', 
            { orderId, error: error.message }, 'medium');
        
        createModal(`
            <h3 style="color: #c62828;">Ошибка</h3>
            <p>Не удалось загрузить детали заказа</p>
            <button onclick="this.closest('.modal-overlay').remove()" 
                    style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                Закрыть
            </button>
        `);
    }
}

function repeatOrder(orderId) {
    try {
        const order = orderHistory.find(o => o.id === orderId);
        if (!order) {
            throw new Error(`Заказ с ID ${orderId} не найден`);
        }
        
        createModal(`
            <h3>Повторить заказ #${order.id}</h3>
            <div style="margin: 20px 0;">
                <p>Вы хотите повторить заказ:</p>
                <p><strong>${order.place || 'Неизвестное место'}</strong></p>
                <p>На ${order.date || 'неизвестную дату'} с ${order.from || '--:--'} до ${order.to || '--:--'}</p>
                <p>Стоимость: ${order.price || 0} ₽</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="confirmRepeatBtn" style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                    Подтвердить
                </button>
                <button id="cancelRepeatBtn" style="padding: 10px 20px; background-color: #ccc; color: #333; border: none; border-radius: 5px;">
                    Отмена
                </button>
            </div>
        `);
        
        document.getElementById('confirmRepeatBtn')?.addEventListener('click', () => {
            try {
                alert('Заказ успешно повторен! Мы скоро свяжемся с вами для подтверждения.');
                document.querySelector('.modal-overlay')?.remove();
                
                // Логируем успешное повторение заказа
                errorHandler.createUserError('Заказ повторен', { orderId }, 'low');
            } catch (error) {
                console.error('Ошибка подтверждения повторного заказа:', error);
                errorHandler.createUserError('Ошибка подтверждения заказа', 
                    { orderId, error: error.message }, 'medium');
            }
        });
        
        document.getElementById('cancelRepeatBtn')?.addEventListener('click', () => {
            try {
                document.querySelector('.modal-overlay')?.remove();
            } catch (error) {
                console.error('Ошибка отмены повторного заказа:', error);
            }
        });
        
    } catch (error) {
        console.error('Ошибка повторения заказа:', error);
        errorHandler.createUserError('Ошибка инициализации повторения заказа', 
            { orderId, error: error.message }, 'medium');
        
        createModal(`
            <h3 style="color: #c62828;">Ошибка</h3>
            <p>Не удалось повторить заказ</p>
            <button onclick="this.closest('.modal-overlay').remove()" 
                    style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                Закрыть
            </button>
        `);
    }
}

function updateStats() {
    try {
        const totalOrders = orderHistory.length;
        const totalAmount = orderHistory.reduce((sum, order) => {
            const price = order.price || 0;
            if (typeof price !== 'number' || isNaN(price)) {
                errorHandler.createUserError('Некорректная цена заказа', 
                    { order, price }, 'low');
                return sum;
            }
            return sum + price;
        }, 0);
        
        const averageOrder = totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0;
        
        const totalOrdersEl = document.getElementById('totalOrders');
        const totalAmountEl = document.getElementById('totalAmount');
        const averageOrderEl = document.getElementById('averageOrder');
        
        if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
        if (totalAmountEl) totalAmountEl.textContent = `${totalAmount} ₽`;
        if (averageOrderEl) averageOrderEl.textContent = `${averageOrder} ₽`;
        
    } catch (error) {
        console.error('Ошибка обновления статистики:', error);
        errorHandler.createUserError('Ошибка расчета статистики', 
            { error: error.message }, 'medium');
    }
}

function showErrorUI() {
    const container = document.getElementById('ordersContainer');
    if (container) {
        container.innerHTML = `
            <div class="box" style="text-align: center; padding: 40px; background-color: #ffebee;">
                <p class="large_letters" style="color: #c62828;">⚠️ Ошибка</p>
                <p class="medium_letters">Не удалось загрузить историю заказов</p>
                <p class="small_letters" style="margin: 20px 0;">
                    Возможно, проблема с сохраненными данными или браузером.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="location.reload()" 
                            style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                        Обновить страницу
                    </button>
                    <button onclick="localStorage.clear(); location.reload()" 
                            style="padding: 10px 20px; background-color: #ff9800; color: white; border: none; border-radius: 5px;">
                        Очистить данные
                    </button>
                </div>
            </div>
        `;
    }
}

// Экспортируем функции для тестирования
export { renderOrders, updateStats, showOrderDetails, repeatOrder };