import React, { useState } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import OrderDetails from '../components/OrderDetails/OrderDetails'
import Modal from '../components/Modal/Modal'
import useLocalStorage from '../hooks/useLocalStorage'
import { initialOrderData, initialReviews } from '../data/initialData'
import styles from './HomePage.module.css'

const HomePage = () => {
  const [orderData] = useLocalStorage('orderData', initialOrderData)
  const [reviews, setReviews] = useLocalStorage('reviews', initialReviews)
  const [profileSettings] = useLocalStorage('profileSettings', { name: 'Адолат Бердиева' })
  
  const [showChat, setShowChat] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)

  const handleOpenChat = () => {
    setShowChat(true)
  }

  const handleOpenReview = () => {
    setShowReview(true)
  }

  const handleSendReview = () => {
    if (!reviewText.trim()) {
      alert('Введите отзыв')
      return
    }

    if (reviewRating === 0) {
      alert('Пожалуйста, поставьте оценку')
      return
    }

    const newReview = {
      id: Date.now(),
      text: reviewText,
      rating: reviewRating,
      date: new Date().toLocaleDateString('ru-RU'),
      timestamp: Date.now()
    }

    setReviews([...reviews, newReview])
    setReviewText('')
    setReviewRating(0)
    setShowReview(false)
    alert('Спасибо за отзыв!')
  }

  return (
    <div className={styles.page}>
      <Header userName={profileSettings.name} />
      
      <OrderDetails 
        orderData={orderData}
        onOpenChat={handleOpenChat}
        onOpenReview={handleOpenReview}
      />

      <Footer />

      {/* Модальное окно чата */}
      <Modal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        title="Чат с поддержкой"
      >
        <div className={styles.chatContent}>
          <p>Здравствуйте! Чем можем помочь?</p>
          <textarea 
            className={styles.chatTextarea}
            rows="3" 
            placeholder="Введите ваше сообщение..."
          ></textarea>
          <div className={styles.chatActions}>
            <button 
              className={styles.sendButton}
              onClick={() => {
                alert('Сообщение отправлено! Мы ответим в течение 15 минут.')
                setShowChat(false)
              }}
            >
              Отправить
            </button>
            <button 
              className={styles.closeButton}
              onClick={() => setShowChat(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно отзыва */}
      <Modal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        title="Оставить отзыв"
      >
        <div className={styles.reviewContent}>
          <div className={styles.ratingSection}>
            <label>Оценка:</label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={styles.star}
                  style={{ color: star <= reviewRating ? '#FFD700' : '#ccc' }}
                  onClick={() => setReviewRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <textarea
            className={styles.reviewTextarea}
            rows="4"
            placeholder="Поделитесь вашими впечатлениями..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          
          <div className={styles.reviewActions}>
            <button 
              className={styles.submitButton}
              onClick={handleSendReview}
            >
              Отправить отзыв
            </button>
            <button 
              className={styles.cancelButton}
              onClick={() => setShowReview(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default HomePage