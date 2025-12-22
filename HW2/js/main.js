// js/main.js
import { initChat, initReview, showReceipt } from './handlers.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chatBtn')
        .addEventListener('click', initChat);

    document.getElementById('reviewBtn')
        .addEventListener('click', initReview);

    document.getElementById('receiptBtn')
        .addEventListener('click', showReceipt);
});
