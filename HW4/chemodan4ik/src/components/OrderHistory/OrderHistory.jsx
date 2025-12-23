import React, { useState } from 'react'
import Modal from '../Modal/Modal'
import styles from './OrderHistory.module.css'

const OrderHistory = ({ orders = [], onRepeatOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showRepeatConfirm, setShowRepeatConfirm] = useState(false)
  const [orderToRepeat, setOrderToRepeat] = useState(null)

  const getStatusText = (status) => {
    const statusMap = {
      'completed': 'Завершен',
      'active': 'Активен',
      'cancelled': 'Отменен',
      'unknown': 'Неизвестен'
    }
    return statusMap[status] || status || 'Неизвестен'
  }

  const getStatusClass = (status) => {
    const statusClassMap = {
      'completed': styles.statusCompleted,
      'active': styles.statusActive,
      'cancelled': styles.statusCancelled
    }
    return statusClassMap[status] || styles.statusUnknown
  }

  const handleShowDetails = (order) => {
    setSelectedOrder(order)
    setShowDetails(true)
  }

  const handleRepeatOrder = (order) => {
    setOrderToRepeat(order)
    setShowRepeatConfirm(true)
  }

  const confirmRepeatOrder = () => {
    if (onRepeatOrder && orderToRepeat) {
      onRepeatOrder(orderToRepeat)
    }
    setShowRepeatConfirm(false)
    setOrderToRepeat(null)
    alert('Заказ успешно повторен! Мы скоро свяжемся с вами для подтверждения.')
  }

  const calculateStats = () => {
    const totalOrders = orders.length
    const totalAmount = orders.reduce((sum, order) => sum + (order.price || 0), 0)
    const averageOrder = totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0
    
    return { totalOrders, totalAmount, averageOrder }
  }

  const stats = calculateStats()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>История заказов</h1>
      <p className={styles.subtitle}>
        Здесь вы можете посмотреть все ваши предыдущие заказы
      </p>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>У вас пока нет заказов</p>
        </div>
      ) : (
        <>
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <h3 className={styles.orderPlace}>{order.place}</h3>
                    <p className={styles.orderAddress}>{order.address}</p>
                  </div>
                  <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className={styles.orderDetailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Дата</span>
                    <span className={styles.detailValue}>{order.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Время</span>
                    <span className={styles.detailValue}>{order.from} - {order.to}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Багаж</span>
                    <span className={styles.detailValue}>{order.luggage}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Стоимость</span>
                    <span className={styles.detailValue}>{order.price} ₽</span>
                  </div>
                </div>

                <div className={styles.orderActions}>
                  <button 
                    className={styles.detailsButton}
                    onClick={() => handleShowDetails(order)}
                  >
                    Подробнее
                  </button>
                  <button 
                    className={styles.repeatButton}
                    onClick={() => handleRepeatOrder(order)}
                  >
                    Повторить заказ
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.statsCard}>
            <h3 className={styles.statsTitle}>Статистика заказов</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <p className={styles.statLabel}>Всего заказов</p>
                <p className={styles.statValue}>{stats.totalOrders}</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statLabel}>Общая сумма</p>
                <p className={styles.statValue}>{stats.totalAmount} ₽</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statLabel}>Средний чек</p>
                <p className={styles.statValue}>{stats.averageOrder} ₽</p>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={`Детали заказа #${selectedOrder?.id || ''}`}
      >
        {selectedOrder && (
          <div className={styles.orderDetailsContent}>
            <p><strong>Место:</strong> {selectedOrder.place}</p>
            <p><strong>Адрес:</strong> {selectedOrder.address}</p>
            <p><strong>Дата:</strong> {selectedOrder.date}</p>
            <p><strong>Время:</strong> {selectedOrder.from} - {selectedOrder.to} ({selectedOrder.duration})</p>
            <p><strong>Багаж:</strong> {selectedOrder.luggage}</p>
            <p><strong>Стоимость:</strong> {selectedOrder.price} ₽</p>
            <p><strong>Статус:</strong> {getStatusText(selectedOrder.status)}</p>
          </div>
        )}
        <div className={styles.modalActions}>
          <button 
            className={styles.closeModalButton}
            onClick={() => setShowDetails(false)}
          >
            Закрыть
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showRepeatConfirm}
        onClose={() => setShowRepeatConfirm(false)}
        title={`Повторить заказ #${orderToRepeat?.id || ''}`}
      >
        {orderToRepeat && (
          <div className={styles.repeatConfirmContent}>
            <p>Вы хотите повторить заказ:</p>
            <p><strong>{orderToRepeat.place}</strong></p>
            <p>На {orderToRepeat.date} с {orderToRepeat.from} до {orderToRepeat.to}</p>
            <p>Стоимость: {orderToRepeat.price} ₽</p>
          </div>
        )}
        <div className={styles.modalActions}>
          <button 
            className={styles.confirmButton}
            onClick={confirmRepeatOrder}
          >
            Подтвердить
          </button>
          <button 
            className={styles.cancelButton}
            onClick={() => setShowRepeatConfirm(false)}
          >
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default OrderHistory