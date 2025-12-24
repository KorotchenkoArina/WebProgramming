import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import OrderHistory from '../components/OrderHistory/OrderHistory'
import { initialOrderHistory } from '../data/initialData'
import styles from './OrderHistoryPage.module.css'

const OrderHistoryPage = () => {
  const navigate = useNavigate()
  
  // Для теста используем данные напрямую из initialData
  // В реальном приложении здесь был бы useLocalStorage или API запрос
  const orders = initialOrderHistory

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <div className={styles.backSection} onClick={handleBackClick}>
        <div className={styles.backContent}>
          <img 
            src="/images/back_arrow.png" 
            alt="Назад" 
            className={styles.backIcon} 
          />
          <span className={styles.backTitle}>История заказов</span>
        </div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Ваши предыдущие заказы</h1>
        <p className={styles.subtitle}>
          Здесь вы можете посмотреть все ваши предыдущие заказы
        </p>
        
        <OrderHistory orders={orders} />
      </div>

      <Footer />
    </div>
  )
}

export default OrderHistoryPage