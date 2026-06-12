import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/log-meal', label: 'Log Meal', icon: '🍽️' },
    { path: '/history', label: 'History', icon: '📅' },
    { path: '/ai-analyzer', label: 'AI Analyze', icon: '🤖' },
    { path: '/bmi', label: 'BMI / TDEE', icon: '🧮' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandDot}>🥗</div>
        <span style={styles.brandName}>NutriTrack</span>
      </div>

      <div style={styles.navList}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(location.pathname === item.path ? styles.navItemActive : {})
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        🚪 Logout
      </button>
    </div>
  )
}

const styles = {
  sidebar: {
    width: '220px',
    minHeight: '100vh',
    background: '#1a1a2e',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  brand: {
    display: 'flex', alignItems: 'center',
    gap: '10px', marginBottom: '2rem'
  },
  brandDot: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
  },
  brandName: { fontSize: '18px', fontWeight: '600', color: '#fff' },
  navList: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '8px',
    color: 'rgba(255,255,255,0.55)', fontSize: '13px',
    textDecoration: 'none', transition: 'all 0.2s'
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff'
  },
  logoutBtn: {
    background: 'transparent', color: 'rgba(255,255,255,0.5)',
    padding: '10px 12px', borderRadius: '8px',
    fontSize: '13px', textAlign: 'left', cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.1)'
  }
}

export default Navbar