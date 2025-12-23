export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  phone: (phone) => {
    const regex = /^\+?[\d\s\-\(\)]+$/
    return regex.test(phone)
  },

  required: (value) => {
    return value && value.toString().trim().length > 0
  },

  minLength: (value, length) => {
    return value && value.toString().trim().length >= length
  },

  maxLength: (value, length) => {
    return value && value.toString().trim().length <= length
  }
}