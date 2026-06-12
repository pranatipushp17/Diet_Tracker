import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/auth/login', { email, password })
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.brandDot}>🥗</div>
          <span style={styles.brandName}>NutriTrack</span>
        </div>
        <div style={styles.tagline}>
          Track what you eat,<br />
          <span style={{ color: 'var(--purple)' }}>feel what you deserve</span>
        </div>
        <div style={styles.perks}>
          <div style={styles.perk}>🇮🇳 Indian food database included</div>
          <div style={styles.perk}>🤖 AI-powered meal analysis</div>
          <div style={styles.perk}>📊 BMI, TDEE & calorie goals</div>
          <div style={styles.perk}>📈 Visual weekly insights</div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.sub}>Sign in to your account</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={styles.switch}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--purple)' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
  },
  left: {
    flex: 1,
    background: 'var(--dark)',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '2rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandDot: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  brandName: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#fff',
  },
  tagline: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#fff',
    lineHeight: '1.4',
  },
  perks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  perk: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
  },
  right: {
    flex: 1,
    background: 'var(--gray)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBox: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: 'var(--dark)',
    marginBottom: '4px',
  },
  sub: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
  },
  error: {
    background: '#fee2e2',
    color: '#ef4444',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1.5px solid var(--border)',
    fontSize: '14px',
    color: 'var(--dark)',
    background: '#fff',
    transition: 'border 0.2s',
  },
  btn: {
    background: 'linear-gradient(135deg, var(--purple), #818cf8)',
    color: '#fff',
    padding: '11px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  switch: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginTop: '1.25rem',
  },
}

export default Login