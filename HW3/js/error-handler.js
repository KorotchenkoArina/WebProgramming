// js/error-handler.js
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50; // Максимальное количество хранимых ошибок
        this.initialized = false;
    }
    
    // Инициализация глобальных обработчиков
    init() {
        if (this.initialized) return;
        
        // Обработчик ошибок JavaScript
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'js_error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.stack,
                timestamp: new Date().toISOString()
            });
        });
        
        // Обработчик необработанных промисов
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise_rejection',
                reason: event.reason?.toString(),
                stack: event.reason?.stack,
                timestamp: new Date().toISOString()
            });
        });
        
        // Обработчик ошибок загрузки ресурсов
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            resources.forEach(resource => {
                if (resource.initiatorType === 'script' || 
                    resource.initiatorType === 'css' ||
                    resource.initiatorType === 'img') {
                    
                    if (resource.duration === 0 && resource.transferSize === 0) {
                        this.logError({
                            type: 'resource_error',
                            resource: resource.name,
                            initiatorType: resource.initiatorType,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            });
        });
        
        this.initialized = true;
    }
    
    // Логирование ошибки
    logError(errorData) {
        try {
            // Добавляем ошибку в массив
            this.errors.push(errorData);
            
            // Ограничиваем размер массива
            if (this.errors.length > this.maxErrors) {
                this.errors.shift();
            }
            
            // Сохраняем в localStorage (если доступен)
            if (typeof localStorage !== 'undefined') {
                try {
                    localStorage.setItem('app_errors', JSON.stringify(this.errors));
                } catch (e) {
                    // Если localStorage переполнен, очищаем старые ошибки
                    if (e.name === 'QuotaExceededError') {
                        this.errors = [errorData];
                    }
                }
            }
            
            // Выводим в консоль в development
            if (process.env.NODE_ENV === 'development') {
                console.error('Зарегистрирована ошибка:', errorData);
            }
            
            // Можно отправить на сервер (раскомментировать при наличии бэкенда)
            // this.sendToServer(errorData);
            
        } catch (error) {
            console.error('Ошибка при логировании ошибки:', error);
        }
    }
    
    // Получить все ошибки
    getErrors() {
        return this.errors;
    }
    
    // Очистить ошибки
    clearErrors() {
        this.errors = [];
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('app_errors');
        }
    }
    
    // Отправить ошибку на сервер (заглушка для примера)
    sendToServer(errorData) {
        // В реальном приложении здесь был бы fetch запрос
        console.log('Отправка ошибки на сервер:', errorData);
        /*
        fetch('/api/log-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorData)
        }).catch(() => {
            // Игнорируем ошибки отправки
        });
        */
    }
    
    // Создать пользовательскую ошибку
    createUserError(message, context = {}, severity = 'medium') {
        const error = {
            type: 'user_error',
            message,
            context,
            severity,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.logError(error);
        return error;
    }
    
    // Проверка, есть ли критические ошибки
    hasCriticalErrors() {
        return this.errors.some(error => 
            error.type === 'js_error' || 
            error.severity === 'critical'
        );
    }
    
    // Показать пользователю информацию об ошибках
    showErrorReport() {
        if (this.errors.length === 0) {
            alert('Ошибок не обнаружено!');
            return;
        }
        
        const criticalCount = this.errors.filter(e => 
            e.severity === 'critical' || e.type === 'js_error'
        ).length;
        
        const report = `
            Отчет об ошибках:
            Всего ошибок: ${this.errors.length}
            Критических: ${criticalCount}
            Последняя ошибка: ${new Date(this.errors[this.errors.length - 1].timestamp).toLocaleString()}
            
            Для подробного отчета откройте консоль разработчика (F12).
        `;
        
        alert(report);
    }
}

// Создаем глобальный экземпляр
const errorHandler = new ErrorHandler();

// Экспортируем для использования в других модулях
export default errorHandler;

// Также делаем доступным глобально (опционально)
if (typeof window !== 'undefined') {
    window.AppErrorHandler = errorHandler;
}