import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ProfileSettings from '../components/ProfileSettings/ProfileSettings'
import useLocalStorage from '../hooks/useLocalStorage'
import { initialProfileSettings } from '../data/initialData'
import styles from './ProfileSettingsPage.module.css'

const ProfileSettingsPage = () => {
  const navigate = useNavigate()
  const [profileSettings, setProfileSettings] = useLocalStorage('profileSettings', initialProfileSettings)

  const handleSaveProfile = (updatedSettings) => {
    setProfileSettings(updatedSettings)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      // Очищаем все данные пользователя
      localStorage.clear()
      // Перенаправляем на главную страницу
      navigate('/')
    }
  }

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <Header userName={profileSettings.name} />
      
      <div className={styles.backSection} onClick={handleBackClick}>
        <div className={styles.backContent}>
          <img 
            src="/images/back_arrow.png" 
            alt="Назад" 
            className={styles.backIcon} 
          />
          <span className={styles.backTitle}>Настройки профиля</span>
        </div>
      </div>

      <ProfileSettings 
        profileSettings={profileSettings}
        onSaveProfile={handleSaveProfile}
        onDeleteAccount={handleDeleteAccount}
      />

      <Footer />
    </div>
  )
}

export default ProfileSettingsPage