import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'female',
    height: '',
    weight: '',
    activityLevel: 'lightly_active',
    weightGoal: 'maintain'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/auth/register', formData)
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
          Start your journey<br />
          <span style={{ color: 'var(--purple)' }}>one meal at a time</span>
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
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.sub}>Fill in your details to get started</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Full name</label>
                <input style={styles.input} name="name" placeholder="Pranati" onChange={handleChange} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Age</label>
                <input style={styles.input} name="age" type="number" placeholder="21" onChange={handleChange} required />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Height (cm)</label>
                <input style={styles.input} name="height" type="number" placeholder="165" onChange={handleChange} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Weight (kg)</label>
                <input style={styles.input} name="weight" type="number" placeholder="58" onChange={handleChange} required />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Gender</label>
                <select style={styles.input} name="gender" onChange={handleChange}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Goal</label>
                <select style={styles.input} name="weightGoal" onChange={handleChange}>
                  <option value="maintain">Maintain</option>
                  <option value="lose">Lose weight</option>
                  <option value="gain">Gain weight</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Activity level</label>
              <select style={styles.input} name="activityLevel" onChange={handleChange}>
                <option value="sedentary">Sedentary (desk job)</option>
                <option value="lightly_active">Lightly active (student life)</option>
                <option value="moderately_active">Moderately active</option>
                <option value="very_active">Very active</option>
              </select>
            </div>

            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={styles.switch}>
            Already have an account?{' '}
            <Link to="/" style={{ color: 'var(--purple)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, background: 'var(--dark)', padding: '3rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem'
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandDot: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #FF6B9D, #FFB347)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
  },
  brandName: { fontSize: '22px', fontWeight: '600', color: '#fff' },
  tagline: { fontSize: '28px', fontWeight: '600', color: '#fff', lineHeight: '1.4' },
  perks: { display: 'flex', flexDirection: 'column', gap: '12px' },
  perk: { color: 'rgba(255,255,255,0.7)', fontSize: '14px' },
  right: {
    flex: 1, background: 'var(--gray)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0'
  },
  formBox: {
    background: '#fff', borderRadius: '16px', padding: '2rem',
    width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
  },
  title: { fontSize: '22px', fontWeight: '600', color: 'var(--dark)', marginBottom: '4px' },
  sub: { fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '1.5rem' },
  error: {
    background: '#fee2e2', color: '#ef4444',
    padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' },
  input: {
    padding: '10px 12px', borderRadius: '8px',
    border: '1.5px solid var(--border)', fontSize: '14px',
    color: 'var(--dark)', background: '#fff'
  },
  btn: {
    background: 'linear-gradient(135deg, var(--purple), #818cf8)',
    color: '#fff', padding: '11px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', marginTop: '0.5rem'
  },
  switch: { fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1.25rem' }
}

export default Register