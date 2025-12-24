import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/order-history" element={<OrderHistoryPage />} />
      <Route path="/profile-settings" element={<ProfileSettingsPage />} />
    </Routes>
  )
}

export default App