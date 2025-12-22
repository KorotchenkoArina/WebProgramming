// js/handlers.js
import { createModal } from './ui.js';
import { orderData, reviews } from './data.js';

export function initChat() {
    const modal = createModal(`
        <h3>Чат с поддержкой</h3>
        <p>Здравствуйте! Чем можем помочь?</p>
        <button id="closeChatBtn">Закрыть</button>
    `);

    document.getElementById('closeChatBtn')
        .addEventListener('click', () => {
            modal.remove();
        });
}

export function initReview() {
    const modal = createModal(`
        <h3>Оставить отзыв</h3>
        <textarea id="reviewText" rows="4" style="width:100%"></textarea>
        <br><br>
        <button id="sendReviewBtn">Отправить</button>
    `);

    document.getElementById('sendReviewBtn')
        .addEventListener('click', () => {
            const text = document.getElementById('reviewText').value.trim();

            if (!text) {
                alert('Введите отзыв');
                return;
            }

            reviews.push(text);
            alert('Спасибо за отзыв!');
            modal.remove(); // ← «возврат» на главную
        });
}

export function showReceipt() {
    createModal(`
        <h3>Чек</h3>
        <p><b>Место:</b> ${orderData.place}</p>
        <p><b>Сумма:</b> ${orderData.price} ₽</p>
        <p><b>Способ оплаты:</b> ${orderData.payment.method}</p>
        <p><b>Статус:</b> ${orderData.payment.status}</p>
    `);
}
