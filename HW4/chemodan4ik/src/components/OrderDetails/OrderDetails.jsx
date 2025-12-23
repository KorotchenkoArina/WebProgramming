import React, { useState } from 'react'
import Modal from '../Modal/Modal'
import styles from './OrderDetails.module.css'

const OrderDetails = ({ 
  orderData, 
  onOpenChat, 
  onOpenReview, 
  onOpenReceipt 
}) => {
  const [showReceipt, setShowReceipt] = useState(false)

  const handleReceiptClick = () => {
    if (onOpenReceipt) {
      onOpenReceipt()
    } else {
      setShowReceipt(true)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.backSection}>
        <div className={styles.backContent}>
          <img 
            src="/images/back_arrow.png" 
            alt="Назад" 
            className={styles.backIcon} 
          />
          <span className={styles.backTitle}>Детали заказа</span>
        </div>
      </div>

      <div className={styles.placeImageContainer}>
        <img 
          src="/images/kpss.jpg" 
          alt="Кафе КПСС" 
          className={styles.placeImage} 
        />
      </div>

      <h1 className={styles.placeName}>кафе "КПСС"</h1>
      <p className={styles.placeAddress}>пр. Славы 50, г. Сыктывкар</p>

      <div className={styles.actionButtons}>
        <button className={styles.actionButton} onClick={onOpenChat}>
          <span className={styles.buttonText}>Перейти в чат</span>
        </button>
        <button className={styles.actionButton} onClick={onOpenReview}>
          <span className={styles.buttonText}>Оставить отзыв</span>
        </button>
      </div>

      <div className={styles.orderInfo}>
        <div className={styles.orderDetails}>
          <div className={styles.dateBadge}>
            <span className={styles.dateText}>{orderData.date}</span>
          </div>
          
          <div className={styles.timeLabels}>
            <span className={styles.timeLabel}>принести</span>
            <span className={styles.timeLabel}>забрать</span>
          </div>
          
          <div className={styles.timeLine}>
            <span className={styles.timeValue}>{orderData.from}</span>
            <div className={styles.line}></div>
            <span className={styles.duration}>{orderData.duration}</span>
            <div className={styles.line}></div>
            <span className={styles.timeValue}>{orderData.to}</span>
          </div>
          
          <p className={styles.luggageInfo}>{orderData.luggage}</p>
        </div>

        <div className={styles.priceSection}>
          <p className={styles.priceLabel}>Стоимость</p>
          <p className={styles.priceValue}>{orderData.price} рублей</p>
          <div className={styles.paidBadge}>
            <span className={styles.paidText}>Оплачено</span>
          </div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Детали оплаты</h2>
      
      <div className={styles.paymentDetails}>
        <div className={styles.paymentColumns}>
          <div className={styles.paymentColumn}>
            <p className={styles.paymentLabel}>Стоимость</p>
            <p className={styles.paymentLabel}>Статус оплаты</p>
            <p className={styles.paymentLabel}>Способ оплаты</p>
            <p className={styles.paymentLabel}>Банк транзакции</p>
            <p className={styles.paymentLabel}>Реквизиты</p>
          </div>
          
          <div className={styles.paymentColumn}>
            <p className={styles.paymentValue}>{orderData.price} рублей</p>
            <div className={styles.paidBadgeSmall}>
              <span className={styles.paidText}>Оплачено</span>
            </div>
            <p className={styles.paymentValue}>{orderData.payment.method}</p>
            <p className={styles.paymentValue}>{orderData.payment.bank}</p>
            <p className={styles.paymentValue}>{orderData.payment.card}</p>
          </div>
        </div>
        
        <button className={styles.receiptButton} onClick={handleReceiptClick}>
          Посмотреть чек
        </button>
      </div>

      <Modal 
        isOpen={showReceipt} 
        onClose={() => setShowReceipt(false)}
        title="Чек по заказу"
      >
        <div className={styles.receiptContent}>
          <p><strong>Место:</strong> {orderData.place}</p>
          <p><strong>Адрес:</strong> {orderData.address}</p>
          <p><strong>Дата:</strong> {orderData.date}</p>
          <p><strong>Время:</strong> {orderData.from} - {orderData.to}</p>
          <p><strong>Длительность:</strong> {orderData.duration}</p>
          <p><strong>Багаж:</strong> {orderData.luggage}</p>
          <hr className={styles.receiptDivider} />
          <p><strong>Сумма:</strong> {orderData.price} ₽</p>
          <p><strong>Способ оплаты:</strong> {orderData.payment.method}</p>
          <p><strong>Банк:</strong> {orderData.payment.bank}</p>
          <p><strong>Карта:</strong> {orderData.payment.card}</p>
          <p><strong>Статус:</strong> {orderData.payment.status}</p>
        </div>
        <div className={styles.receiptActions}>
          <button 
            className={styles.printButton}
            onClick={() => window.print()}
          >
            Печать чека
          </button>
          <button 
            className={styles.closeButton}
            onClick={() => setShowReceipt(false)}
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default OrderDetails