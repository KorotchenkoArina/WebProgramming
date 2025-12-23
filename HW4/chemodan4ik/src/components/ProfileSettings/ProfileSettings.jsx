import React, { useState } from 'react'
import Modal from '../Modal/Modal'
import styles from './ProfileSettings.module.css'

const ProfileSettings = ({ 
  profileSettings = {}, 
  onSaveProfile, 
  onDeleteAccount 
}) => {
  const [formData, setFormData] = useState({
    name: profileSettings.name || '',
    email: profileSettings.email || '',
    phone: profileSettings.phone || '',
    notifications: {
      email: profileSettings.notifications?.email || true,
      sms: profileSettings.notifications?.sms || true,
      push: profileSettings.notifications?.push || false
    },
    language: profileSettings.language || 'ru',
    currency: profileSettings.currency || 'RUB'
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [avatar, setAvatar] = useState('/images/profile_icon.png')
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }))
  }

  const handleSave = async () => {
    // Validate form
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSaving(true)
    
    try {
      if (onSaveProfile) {
        await onSaveProfile(formData)
      }
      alert('Настройки успешно сохранены!')
    } catch (error) {
      alert('Ошибка при сохранении настроек')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'УДАЛИТЬ' && onDeleteAccount) {
      onDeleteAccount()
      setShowDeleteConfirm(false)
      alert('Аккаунт успешно удален')
    } else {
      alert('Пожалуйста, введите "УДАЛИТЬ" для подтверждения')
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload the file to a server
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Настройки профиля</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Личная информация</h2>
        
        <div className={styles.avatarSection}>
          <img 
            src={avatar} 
            alt="Аватар" 
            className={styles.avatar} 
          />
          <div className={styles.avatarControls}>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleAvatarChange}
              className={styles.fileInput}
            />
            <label htmlFor="avatarUpload" className={styles.uploadButton}>
              Изменить фото
            </label>
            <p className={styles.uploadHint}>
              Рекомендуемый размер: 100x100 пикселей
            </p>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Имя *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Введите ваше имя"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="example@email.com"
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="+7 (000) 000-00-00"
          />
        </div>

        <button 
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Настройки уведомлений</h2>
        
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="email"
              checked={formData.notifications.email}
              onChange={handleNotificationChange}
              className={styles.checkbox}
            />
            Получать уведомления по электронной почте
          </label>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="sms"
              checked={formData.notifications.sms}
              onChange={handleNotificationChange}
              className={styles.checkbox}
            />
            Получать SMS-уведомления
          </label>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="push"
              checked={formData.notifications.push}
              onChange={handleNotificationChange}
              className={styles.checkbox}
            />
            Push-уведомления в браузере
          </label>
        </div>

        <button 
          className={styles.saveButton}
          onClick={() => handleSave()}
        >
          Сохранить настройки уведомлений
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Настройки приложения</h2>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Язык интерфейса</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Валюта</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="RUB">Российский рубль (₽)</option>
              <option value="USD">Доллар США ($)</option>
              <option value="EUR">Евро (€)</option>
              <option value="GBP">Фунт стерлингов (£)</option>
            </select>
          </div>
        </div>

        <button 
          className={styles.saveButton}
          onClick={() => handleSave()}
        >
          Сохранить настройки приложения
        </button>
      </div>

      <div className={`${styles.section} ${styles.dangerSection}`}>
        <h2 className={styles.dangerTitle}>Опасная зона</h2>
        
        <p className={styles.warningText}>
          Удаление аккаунта — это необратимое действие. 
          Все ваши данные будут удалены без возможности восстановления.
        </p>

        <button 
          className={styles.deleteButton}
          onClick={() => setShowDeleteConfirm(true)}
        >
          Удалить аккаунт
        </button>
      </div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Удаление аккаунта"
      >
        <div className={styles.deleteConfirmContent}>
          <p className={styles.deleteWarning}>
            <strong>Внимание!</strong> Это действие необратимо.
          </p>
          <p>Все ваши данные будут удалены:</p>
          <ul className={styles.deleteList}>
            <li>История заказов</li>
            <li>Личная информация</li>
            <li>Настройки профиля</li>
          </ul>
          <p>Для подтверждения введите "УДАЛИТЬ" в поле ниже:</p>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            className={styles.confirmInput}
            placeholder="Введите УДАЛИТЬ"
          />
        </div>
        <div className={styles.modalActions}>
          <button 
            className={styles.confirmDeleteButton}
            onClick={handleDeleteAccount}
            disabled={deleteConfirmation !== 'УДАЛИТЬ'}
          >
            Да, удалить аккаунт
          </button>
          <button 
            className={styles.cancelButton}
            onClick={() => setShowDeleteConfirm(false)}
          >
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default ProfileSettings