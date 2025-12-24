import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logoLink}>
          <h1 className={styles.logo}>ЧЕМОДАН4ИК</h1>
        </Link>
      </div>
      <div className={styles.headerContainer}>
        <div className={styles.navLinks}>
          <Link to="/order-history" className={styles.navLink}>
            История заказов
          </Link>
          <Link to="/profile-settings" className={styles.navLink}>
            Настройки
          </Link>
        </div>
        <span className={styles.userName}>Адолат Бердиева</span>
      </div>
    </header>
  )
}

export default Header