export const initialOrderData = {
  place: 'кафе "КПСС"',
  address: 'пр. Славы 50, г. Сыктывкар',
  date: '01.03.2025',
  from: '16:00',
  to: '20:00',
  duration: '4 часа',
  luggage: '3 чемодана до 25 кг',
  price: 1220,
  payment: {
    status: 'Оплачено',
    method: 'Карта',
    bank: 'Альфа Банк',
    card: '200*************72'
  }
}

export const initialReviews = []

export const initialOrderHistory = [
  {
    id: 1,
    date: '28.02.2025',
    place: 'Ресторан "Белые ночи"',
    address: 'ул. Ленина 15, г. Санкт-Петербург',
    price: 1850,
    status: 'completed',
    luggage: '2 чемодана до 20 кг',
    duration: '3 часа',
    from: '14:00',
    to: '17:00'
  },
  {
    id: 2,
    date: '25.02.2025',
    place: 'Аэропорт Шереметьево',
    address: 'Терминал D, г. Москва',
    price: 3200,
    status: 'completed',
    luggage: '4 чемодана до 30 кг',
    duration: '6 часов',
    from: '08:00',
    to: '14:00'
  }
]

export const initialProfileSettings = {
  name: 'Адолат Бердиева',
  email: 'adolat@example.com',
  phone: '+7 (912) 345-67-89',
  notifications: {
    email: true,
    sms: true,
    push: false
  },
  language: 'ru',
  currency: 'RUB'
}