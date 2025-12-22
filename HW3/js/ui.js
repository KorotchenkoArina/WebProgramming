// js/ui.js
export function createModal(content) {
    try {
        // Проверяем, что content - строка
        if (typeof content !== 'string') {
            console.error('createModal ожидает строку в качестве content');
            content = '<p>Ошибка создания модального окна</p>';
        }

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
            max-width: 500px;
            position: relative;
            font-family: "IBM Plex Mono", monospace;
            max-height: 90vh;
            overflow-y: auto;
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
            color: #666;
            z-index: 1001;
        `;

        // Обработчик закрытия с try-catch
        const closeModal = () => {
            try {
                overlay.remove();
                // Удаляем обработчик клавиатуры
                document.removeEventListener('keydown', handleEscape);
            } catch (error) {
                console.error('Ошибка при закрытии модального окна:', error);
            }
        };

        closeBtn.addEventListener('click', closeModal);

        modal.innerHTML = content;
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        
        // Проверяем, что document.body существует
        if (!document.body) {
            console.error('document.body не существует');
            return null;
        }
        
        document.body.appendChild(overlay);

        // Закрытие по клику вне модалки
        overlay.addEventListener('click', e => {
            try {
                if (e.target === overlay) {
                    closeModal();
                }
            } catch (error) {
                console.error('Ошибка при закрытии по клику вне модалки:', error);
            }
        });

        // Закрытие по Escape
        const handleEscape = (e) => {
            try {
                if (e.key === 'Escape') {
                    closeModal();
                }
            } catch (error) {
                console.error('Ошибка при обработке клавиши Escape:', error);
            }
        };
        
        document.addEventListener('keydown', handleEscape);

        // Блокируем прокрутку страницы под модалкой
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        // Восстанавливаем прокрутку при удалении модалки
        const restoreScroll = () => {
            document.body.style.overflow = originalOverflow;
        };
        
        // Слушаем удаление элемента
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length > 0) {
                    const removed = Array.from(mutation.removedNodes);
                    if (removed.includes(overlay)) {
                        restoreScroll();
                        observer.disconnect();
                    }
                }
            });
        });
        
        observer.observe(document.body, { childList: true });

        return overlay;
    } catch (error) {
        console.error('Критическая ошибка при создании модального окна:', error);
        
        // Пытаемся показать хотя бы простое уведомление
        try {
            alert('Не удалось открыть диалоговое окно. Пожалуйста, обновите страницу.');
        } catch (alertError) {
            console.error('Не удалось даже показать alert:', alertError);
        }
        
        return null;
    }
}

// Дополнительная функция для безопасного показа модальных окон
export function safeCreateModal(content, fallbackAction = null) {
    const modal = createModal(content);
    
    if (!modal && fallbackAction) {
        console.warn('Модальное окно не создано, выполняем fallback действие');
        try {
            fallbackAction();
        } catch (error) {
            console.error('Ошибка при выполнении fallback действия:', error);
        }
    }
    
    return modal;
}