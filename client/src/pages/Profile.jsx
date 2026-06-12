import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    gender: user?.gender || 'female',
    activityLevel: user?.activityLevel || 'lightly_active',
    weightGoal: user?.weightGoal || 'maintain',
    dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await API.put('/user/profile', form)
      login(res.data, localStorage.getItem('token'))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div style={styles.title}>Profile</div>
      </div>

      <div style={styles.content}>

        {/* Left */}
        <div style={styles.left}>

          {/* Avatar card */}
          <div style={styles.avatarCard}>
            <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase() || '?'}</div>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userEmail}>{user?.email}</div>
            <div style={styles.goalBadge}>
              {user?.weightGoal === 'lose' ? '🎯 Lose weight' :
               user?.weightGoal === 'gain' ? '💪 Gain weight' : '⚖️ Maintain weight'}
            </div>
          </div>

          {/* Stats */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>CURRENT STATS</div>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>BMI</div>
                <div style={{ ...styles.statVal, color: '#10b981' }}>{user?.bmi?.toFixed(1) || '--'}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>BMR</div>
                <div style={{ ...styles.statVal, color: '#3b82f6' }}>{user?.bmr || '--'}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>TDEE</div>
                <div style={{ ...styles.statVal, color: '#c084fc' }}>{user?.dailyCalorieGoal || '--'}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Daily Goal</div>
                <div style={{ ...styles.statVal, color: '#f59e0b' }}>{user?.dailyCalorieGoal || '--'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Edit form */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>EDIT PROFILE</div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} name="name" value={form.name} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} name="email" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Age</label>
              <input style={styles.input} name="age" type="number" value={form.age} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Gender</label>
              <select style={styles.input} name="gender" value={form.gender} onChange={handleChange}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Height (cm)</label>
              <input style={styles.input} name="height" type="number" value={form.height} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Weight (kg)</label>
              <input style={styles.input} name="weight" type="number" value={form.weight} onChange={handleChange} />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Weight Goal</label>
            <div style={styles.goalPills}>
              {[
                { value: 'lose', label: '🎯 Lose weight' },
                { value: 'maintain', label: '⚖️ Maintain' },
                { value: 'gain', label: '💪 Gain weight' },
              ].map(g => (
                <div
                  key={g.value}
                  style={{ ...styles.goalPill, ...(form.weightGoal === g.value ? styles.goalPillActive : {}) }}
                  onClick={() => setForm({ ...form, weightGoal: g.value })}
                >
                  {g.label}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Activity Level</label>
            <select style={styles.input} name="activityLevel" value={form.activityLevel} onChange={handleChange}>
              <option value="sedentary">Sedentary</option>
              <option value="lightly_active">Lightly Active</option>
              <option value="moderately_active">Moderately Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Daily Calorie Goal (kcal)</label>
            <input style={styles.input} name="dailyCalorieGoal" type="number" value={form.dailyCalorieGoal} onChange={handleChange} />
          </div>

          <button style={styles.saveBtn} onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : saved ? '✓ Profile saved!' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#f8f6ff' },
  topbar: { background: '#fff', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' },
  title: { fontSize: '16px', fontWeight: '600', color: 'var(--dark)' },
  content: { padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem' },
  left: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  avatarCard: { background: '#fff', borderRadius: '14px', padding: '2rem 1.25rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #c084fc, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#fff' },
  userName: { fontSize: '18px', fontWeight: '600', color: 'var(--dark)' },
  userEmail: { fontSize: '13px', color: 'var(--text-secondary)' },
  goalBadge: { background: '#ede9fe', color: '#7c3aed', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  card: { background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  cardTitle: { fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.06em', fontWeight: '600' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  statBox: { background: '#f8f6ff', borderRadius: '10px', padding: '10px 12px' },
  statLabel: { fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' },
  statVal: { fontSize: '20px', fontWeight: '700' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '14px', color: 'var(--dark)', background: '#fff' },
  goalPills: { display: 'flex', gap: '8px' },
  goalPill: { flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px', textAlign: 'center', cursor: 'pointer', background: '#fff', color: 'var(--text-secondary)' },
  goalPillActive: { background: '#ede9fe', border: '1px solid #c084fc', color: '#7c3aed', fontWeight: '500' },
  saveBtn: { background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', padding: '11px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '0.5rem' },
}

export default Profile