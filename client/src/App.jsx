import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LogMeal from './pages/LogMeal'
import History from './pages/History'
import AIAnalyzer from './pages/AIAnalyzer'
import BMI from './pages/BMI'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'

function Layout({ children }) {
  const location = useLocation()
  const noNavbar = ['/', '/register']
  const showNavbar = !noNavbar.includes(location.pathname)

  return (
    <div style={{ display: 'flex' }}>
      {showNavbar && <Navbar />}
      <div style={{
        marginLeft: showNavbar ? '220px' : '0',
        flex: 1, minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/log-meal" element={<ProtectedRoute><LogMeal /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/ai-analyzer" element={<ProtectedRoute><AIAnalyzer /></ProtectedRoute>} />
          <Route path="/bmi" element={<ProtectedRoute><BMI /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
