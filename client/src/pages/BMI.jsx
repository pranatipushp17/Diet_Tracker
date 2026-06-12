import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function BMI() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    height: user?.height || '',
    weight: user?.weight || '',
    age: user?.age || '',
    gender: user?.gender || 'female',
    activityLevel: user?.activityLevel || 'lightly_active'
  })
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const calculate = () => {
    const h = parseFloat(form.height) / 100
    const w = parseFloat(form.weight)
    const age = parseFloat(form.age)

    const bmi = w / (h * h)

    let bmr
    if (form.gender === 'female') {
      bmr = 447.593 + (9.247 * w) + (3.098 * (form.height)) - (4.330 * age)
    } else {
      bmr = 88.362 + (13.397 * w) + (4.799 * (form.height)) - (5.677 * age)
    }

    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725
    }

    const tdee = bmr * activityMultipliers[form.activityLevel]

    let category
    if (bmi < 18.5) category = { label: 'Underweight', color: '#3b82f6' }
    else if (bmi < 25) category = { label: 'Normal weight', color: '#10b981' }
    else if (bmi < 30) category = { label: 'Overweight', color: '#f59e0b' }
    else category = { label: 'Obese', color: '#ef4444' }

    setResult({
      bmi: bmi.toFixed(1),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      category
    })
  }

  const handleSave = async () => {
    if (!result) return
    try {
      await API.put('/user/profile', {
        height: form.height,
        weight: form.weight,
        age: form.age,
        gender: form.gender,
        activityLevel: form.activityLevel,
        dailyCalorieGoal: result.tdee,
        bmr: result.bmr,
        bmi: parseFloat(result.bmi)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const bmiPointer = result ? Math.min(Math.max(((result.bmi - 10) / 30) * 100, 0), 100) : 0

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div style={styles.title}>BMI & TDEE Calculator</div>
      </div>

      <div style={styles.content}>
        {/* Left: Form */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>YOUR BODY STATS</div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Height (cm)</label>
              <input style={styles.input} name="height" type="number" placeholder="165" value={form.height} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Weight (kg)</label>
              <input style={styles.input} name="weight" type="number" placeholder="58" value={form.weight} onChange={handleChange} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Age</label>
              <input style={styles.input} name="age" type="number" placeholder="21" value={form.age} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Gender</label>
              <select style={styles.input} name="gender" value={form.gender} onChange={handleChange}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Activity Level</label>
            <div style={styles.activityList}>
              {[
                { value: 'sedentary', label: 'Sedentary', sub: 'Desk job, little movement' },
                { value: 'lightly_active', label: 'Lightly Active', sub: 'Student life, light exercise' },
                { value: 'moderately_active', label: 'Moderately Active', sub: 'Exercise 3-5 days/week' },
                { value: 'very_active', label: 'Very Active', sub: 'Hard exercise daily' },
              ].map(a => (
                <div
                  key={a.value}
                  style={{ ...styles.activityItem, ...(form.activityLevel === a.value ? styles.activityActive : {}) }}
                  onClick={() => setForm({ ...form, activityLevel: a.value })}
                >
                  <div style={styles.activityLabel}>{a.label}</div>
                  <div style={styles.activitySub}>{a.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <button style={styles.calcBtn} onClick={calculate}>Calculate</button>
        </div>

        {/* Right: Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {result ? (
            <>
              <div style={styles.card}>
                <div style={styles.cardTitle}>YOUR BMI</div>
                <div style={styles.bmiScore}>{result.bmi}</div>
                <div style={{ ...styles.bmiCategory, color: result.category.color }}>
                  {result.category.label} ✓
                </div>
                <div style={styles.scaleWrap}>
                  <div style={styles.scale}>
                    <div style={{ ...styles.pointer, left: `${bmiPointer}%` }}></div>
                  </div>
                  <div style={styles.scaleLabels}>
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>BMR</div>
                  <div style={{ ...styles.statVal, color: '#3b82f6' }}>{result.bmr} <span style={styles.statUnit}>kcal</span></div>
                  <div style={styles.statDesc}>Calories at rest</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>TDEE</div>
                  <div style={{ ...styles.statVal, color: '#c084fc' }}>{result.tdee} <span style={styles.statUnit}>kcal</span></div>
                  <div style={styles.statDesc}>Daily calorie need</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Lose weight</div>
                  <div style={{ ...styles.statVal, color: '#10b981' }}>{result.tdee - 500} <span style={styles.statUnit}>kcal</span></div>
                  <div style={styles.statDesc}>500 kcal deficit</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Gain weight</div>
                  <div style={{ ...styles.statVal, color: '#f59e0b' }}>{result.tdee + 500} <span style={styles.statUnit}>kcal</span></div>
                  <div style={styles.statDesc}>500 kcal surplus</div>
                </div>
              </div>

              <button style={styles.saveBtn} onClick={handleSave}>
                {saved ? '✓ Saved as my goal!' : 'Save & set as my daily goal'}
              </button>
            </>
          ) : (
            <div style={styles.emptyResult}>
              <div style={styles.emptyEmoji}>🧮</div>
              <div style={styles.emptyText}>Fill in your stats and click Calculate!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#f8f6ff' },
  topbar: { background: '#fff', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' },
  title: { fontSize: '16px', fontWeight: '600', color: 'var(--dark)' },
  content: { padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  cardTitle: { fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.06em', fontWeight: '600' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '14px', color: 'var(--dark)', background: '#fff' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  activityItem: { padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', background: '#fff' },
  activityActive: { background: '#ede9fe', border: '1px solid #c084fc' },
  activityLabel: { fontSize: '13px', fontWeight: '500', color: 'var(--dark)' },
  activitySub: { fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' },
  calcBtn: { background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', padding: '11px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' },
  bmiScore: { fontSize: '56px', fontWeight: '700', color: 'var(--dark)', lineHeight: 1, textAlign: 'center' },
  bmiCategory: { fontSize: '16px', fontWeight: '600', textAlign: 'center' },
  scaleWrap: { display: 'flex', flexDirection: 'column', gap: '4px' },
  scale: { height: '10px', borderRadius: '5px', background: 'linear-gradient(to right, #3b82f6, #10b981, #f59e0b, #ef4444)', position: 'relative' },
  pointer: { width: '14px', height: '14px', borderRadius: '50%', background: '#fff', border: '2px solid #333', position: 'absolute', top: '-2px', transform: 'translateX(-50%)' },
  scaleLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  statBox: { background: '#fff', borderRadius: '14px', padding: '1rem', border: '1px solid var(--border)' },
  statLabel: { fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.06em', marginBottom: '4px' },
  statVal: { fontSize: '22px', fontWeight: '700' },
  statUnit: { fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)' },
  statDesc: { fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' },
  saveBtn: { background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' },
  emptyResult: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' },
  emptyEmoji: { fontSize: '48px' },
  emptyText: { fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' },
}

export default BMI