// js/profileSettingsMain.js
import { profileSettings, saveData } from './data.js';
import { createModal } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadProfileSettings();
        setupEventListeners();
    } catch (error) {
        console.error('Ошибка инициализации страницы настроек:', error);
        showErrorToUser('Не удалось загрузить страницу настроек. Пожалуйста, обновите страницу.');
    }
});

function loadProfileSettings() {
    try {
        // Разбиваем имя на части
        const nameParts = profileSettings.name.split(' ');
        document.getElementById('nameInput').value = nameParts[0] || '';
        document.getElementById('surnameInput').value = nameParts.slice(1).join(' ') || '';
        document.getElementById('emailInput').value = profileSettings.email || '';
        document.getElementById('phoneInput').value = profileSettings.phone || '';
        
        // Настройки уведомлений
        if (profileSettings.notifications) {
            document.getElementById('emailNotifications').checked = profileSettings.notifications.email || true;
            document.getElementById('smsNotifications').checked = profileSettings.notifications.sms || true;
            document.getElementById('pushNotifications').checked = profileSettings.notifications.push || false;
        }
        
        // Настройки приложения
        document.getElementById('languageSelect').value = profileSettings.language || 'ru';
        document.getElementById('currencySelect').value = profileSettings.currency || 'RUB';
    } catch (error) {
        console.error('Ошибка загрузки настроек профиля:', error);
        showErrorToUser('Не удалось загрузить настройки профиля. Используются значения по умолчанию.');
    }
}

function setupEventListeners() {
    try {
        document.getElementById('savePersonalInfoBtn').addEventListener('click', savePersonalInfo);
        document.getElementById('saveNotificationsBtn').addEventListener('click', saveNotificationSettings);
        document.getElementById('saveAppSettingsBtn').addEventListener('click', saveAppSettings);
        document.getElementById('changeAvatarBtn').addEventListener('click', changeAvatar);
        document.getElementById('deleteAccountBtn').addEventListener('click', deleteAccount);
    } catch (error) {
        console.error('Ошибка настройки обработчиков событий:', error);
    }
}

function savePersonalInfo() {
    try {
        const name = document.getElementById('nameInput').value.trim();
        const surname = document.getElementById('surnameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const phone = document.getElementById('phoneInput').value.trim();
        
        // Валидация
        if (!name) {
            alert('Пожалуйста, введите имя');
            return;
        }
        
        if (!email) {
            alert('Пожалуйста, введите email');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }
        
        const fullName = surname ? `${name} ${surname}` : name;
        
        // Обновляем настройки
        profileSettings.name = fullName;
        profileSettings.email = email;
        profileSettings.phone = phone;
        
        // Сохраняем с обработкой ошибок
        const saved = saveData.saveProfileSettings();
        
        if (saved) {
            // Обновляем имя в шапке
            document.querySelectorAll('#name').forEach(el => {
                el.textContent = fullName;
            });
            
            alert('Личная информация успешно сохранена!');
        } else {
            alert('Не удалось сохранить данные. Проверьте настройки браузера.');
        }
    } catch (error) {
        console.error('Ошибка сохранения личной информации:', error);
        alert('Произошла ошибка при сохранении. Попробуйте еще раз.');
    }
}

function saveNotificationSettings() {
    try {
        const emailNotifications = document.getElementById('emailNotifications').checked;
        const smsNotifications = document.getElementById('smsNotifications').checked;
        const pushNotifications = document.getElementById('pushNotifications').checked;
        
        // Инициализируем объект, если его нет
        if (!profileSettings.notifications) {
            profileSettings.notifications = {};
        }
        
        profileSettings.notifications.email = emailNotifications;
        profileSettings.notifications.sms = smsNotifications;
        profileSettings.notifications.push = pushNotifications;
        
        const saved = saveData.saveProfileSettings();
        
        if (saved) {
            alert('Настройки уведомлений сохранены!');
        } else {
            alert('Не удалось сохранить настройки уведомлений.');
        }
    } catch (error) {
        console.error('Ошибка сохранения настроек уведомлений:', error);
        alert('Ошибка при сохранении настроек уведомлений.');
    }
}

function saveAppSettings() {
    try {
        const language = document.getElementById('languageSelect').value;
        const currency = document.getElementById('currencySelect').value;
        
        profileSettings.language = language;
        profileSettings.currency = currency;
        
        const saved = saveData.saveProfileSettings();
        
        if (saved) {
            alert('Настройки приложения сохранены!');
        } else {
            alert('Не удалось сохранить настройки приложения.');
        }
    } catch (error) {
        console.error('Ошибка сохранения настроек приложения:', error);
        alert('Ошибка при сохранении настроек приложения.');
    }
}

function changeAvatar() {
    createModal(`
        <h3>Изменение аватара</h3>
        <div style="margin: 20px 0;">
            <p>Вы можете загрузить новое изображение для профиля</p>
            <div style="margin: 20px 0; text-align: center;">
                <img src="images/profile_icon.png" alt="Текущий аватар" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #743050;">
            </div>
        </div>
        <div style="display: flex; gap: 10px; flex-direction: column;">
            <input type="file" id="avatarUpload" accept="image/*" style="padding: 10px;">
            <div style="display: flex; gap: 10px;">
                <button id="uploadAvatarBtn" style="padding: 10px 20px; background-color: #743050; color: white; border: none; border-radius: 5px;">
                    Загрузить
                </button>
                <button id="cancelAvatarBtn" style="padding: 10px 20px; background-color: #ccc; color: #333; border: none; border-radius: 5px;">
                    Отмена
                </button>
            </div>
        </div>
    `);
    
    try {
        document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
            const fileInput = document.getElementById('avatarUpload');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                
                // Валидация файла
                if (!file.type.startsWith('image/')) {
                    alert('Пожалуйста, выберите изображение');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) { // 5MB
                    alert('Размер файла не должен превышать 5MB');
                    return;
                }
                
                // В реальном приложении здесь была бы загрузка файла на сервер
                alert('Аватар успешно изменен!');
                document.querySelector('.modal-overlay')?.remove();
            } else {
                alert('Пожалуйста, выберите файл для загрузки');
            }
        });
        
        document.getElementById('cancelAvatarBtn').addEventListener('click', () => {
            document.querySelector('.modal-overlay')?.remove();
        });
    } catch (error) {
        console.error('Ошибка обработки аватара:', error);
        alert('Ошибка при загрузке аватара.');
    }
}

function deleteAccount() {
    createModal(`
        <h3 style="color: #ff6b6b;">Удаление аккаунта</h3>
        <div style="margin: 20px 0;">
            <p><strong>Внимание!</strong> Это действие необратимо.</p>
            <p>Все ваши данные будут удалены:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>История заказов</li>
                <li>Личная информация</li>
                <li>Настройки профиля</li>
            </ul>
            <p>Для подтверждения введите "УДАЛИТЬ" в поле ниже:</p>
            <input type="text" id="confirmDeleteInput" placeholder="Введите УДАЛИТЬ" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ff6b6b; border-radius: 5px;">
        </div>
        <div style="display: flex; gap: 10px;">
            <button id="confirmDeleteBtn" style="padding: 10px 20px; background-color: #ff6b6b; color: white; border: none; border-radius: 5px;" disabled>
                Да, удалить аккаунт
            </button>
            <button id="cancelDeleteBtn" style="padding: 10px 20px; background-color: #ccc; color: #333; border: none; border-radius: 5px;">
                Отмена
            </button>
        </div>
    `);
    
    try {
        const confirmInput = document.getElementById('confirmDeleteInput');
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        
        confirmInput.addEventListener('input', (e) => {
            confirmBtn.disabled = e.target.value !== 'УДАЛИТЬ';
        });
        
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            try {
                // Удаляем все данные
                localStorage.clear();
                alert('Аккаунт успешно удален. Вы будете перенаправлены на главную страницу.');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } catch (error) {
                console.error('Ошибка удаления аккаунта:', error);
                alert('Не удалось удалить аккаунт. Попробуйте еще раз.');
            }
        });
        
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            document.querySelector('.modal-overlay')?.remove();
        });
    } catch (error) {
        console.error('Ошибка в диалоге удаления аккаунта:', error);
        alert('Ошибка при удалении аккаунта.');
    }
}

// Вспомогательные функции
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showErrorToUser(message) {
    // Можно заменить на более красивый toast/notification
    console.error('Пользовательская ошибка:', message);
    
    // Создаем временное уведомление
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ff6b6b;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}