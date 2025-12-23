import React from 'react'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <p>
          По всем претензиям обращаться<br />
          к Л.Бенидовской, А.Коротченко<br />
          и В.Совгирь, но лучше не надо :)
        </p>
      </div>
      <div className={styles.footerCenter}>
        <img 
          src="/images/heart_icon.png" 
          alt="Сердечко" 
          className={styles.footerIcon} 
        />
      </div>
      <div className={styles.footerRight}>
        <p>
          Контакты<br />
          Почта: avkorotchenko@edu.hse.ru<br />
          Телефон: +71234567890
        </p>
      </div>
    </footer>
  )
}

export default Footer