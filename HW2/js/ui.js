// js/ui.js
export function createModal(content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        min-width: 320px;
        position: relative;
        font-family: IBM Plex Mono;
    `;

    // Крестик
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '✖';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        cursor: pointer;
        font-size: 18px;
    `;

    closeBtn.addEventListener('click', () => overlay.remove());

    modal.innerHTML += content;
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Закрытие по клику вне модалки
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    return overlay; // ← важно!
}