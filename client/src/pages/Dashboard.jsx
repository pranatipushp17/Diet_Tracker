import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function Dashboard() {
  const { user } = useAuth()
  const [dailyLog, setDailyLog] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [dailyRes, weeklyRes, mealsRes] = await Promise.all([
        API.get(`/daily/${today}`),
        API.get('/daily/weekly'),
        API.get(`/meals/${today}`)
      ])
      setDailyLog(dailyRes.data)
      setWeeklyData(weeklyRes.data)
      setMeals(mealsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteMeal = async (id) => {
    try {
      await API.delete(`/meals/${id}`)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const calorieGoal = user?.dailyCalorieGoal || 2000
  const consumed = dailyLog?.totalCalories || 0
  const remaining = calorieGoal - consumed
  const percentage = Math.min((consumed / calorieGoal) * 100, 100)

  const macroData = [
    { name: 'Protein', value: dailyLog?.totalProtein || 0, color: '#3b82f6' },
    { name: 'Carbs', value: dailyLog?.totalCarbs || 0, color: '#f59e0b' },
    { name: 'Fat', value: dailyLog?.totalFat || 0, color: '#ec4899' },
  ]

  const mealIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snacks: '🍎'
  }

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div style={styles.greeting}>Good morning, {user?.name} 👋</div>
        <div style={styles.dateBadge}>{new Date().toDateString()}</div>
      </div>

      <div style={styles.content}>

        {/* Row 1 */}
        <div style={styles.row3}>

          {/* Calorie Ring */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>TODAY'S CALORIES</div>
            <div style={styles.ringWrap}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f3e8ff" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="#c084fc" strokeWidth="10"
                  strokeDasharray={`${(percentage / 100) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div style={styles.ringCenter}>
                <div style={styles.ringNum}>{consumed}</div>
                <div style={styles.ringLabel}>kcal</div>
              </div>
            </div>
            <div style={styles.ringStats}>
              <div style={styles.ringStat}>
                <span style={styles.rsLabel}>Goal</span>
                <span style={styles.rsVal}>{calorieGoal}</span>
              </div>
              <div style={styles.ringStat}>
                <span style={styles.rsLabel}>Eaten</span>
                <span style={{ ...styles.rsVal, color: '#c084fc' }}>{consumed}</span>
              </div>
              <div style={styles.ringStat}>
                <span style={styles.rsLabel}>Left</span>
                <span style={{ ...styles.rsVal, color: remaining >= 0 ? '#10b981' : '#ef4444' }}>{remaining}</span>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>MACROS</div>
            {macroData.every(m => m.value === 0) ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', padding: '2rem 0' }}>
                Log a meal to see macros!
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={macroData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                      {macroData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={styles.macroLegend}>
                  {macroData.map((m) => (
                    <div key={m.name} style={styles.macroItem}>
                      <div style={{ ...styles.macroDot, background: m.color }}></div>
                      <span style={styles.macroName}>{m.name}</span>
                      <span style={styles.macroVal}>{m.value}g</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Weekly Chart */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>WEEKLY TREND</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="calories" fill="#c084fc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2 */}
        <div style={styles.row2}>

          {/* Meals */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>TODAY'S MEALS</div>
            {meals.length === 0 ? (
              <div style={styles.empty}>No meals logged today. <a href="/log-meal" style={{ color: 'var(--purple)' }}>Add one?</a></div>
            ) : (
              meals.map((meal) => (
                <div key={meal._id} style={styles.mealItem}>
                  <div style={styles.mealLeft}>
                    <div style={styles.mealIcon}>{mealIcons[meal.mealType]}</div>
                    <div>
                      <div style={styles.mealName}>{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}</div>
                      <div style={styles.mealSub}>{meal.foods.map(f => f.name).join(', ')}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={styles.mealCal}>{meal.totalCalories} kcal</div>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteMeal(meal._id)}
                    >🗑</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* BMI + Water */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>STATS</div>
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>BMI</div>
                  <div style={{ ...styles.statVal, color: '#10b981' }}>{user?.bmi?.toFixed(1) || '--'}</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>TDEE</div>
                  <div style={{ ...styles.statVal, color: '#c084fc' }}>{user?.dailyCalorieGoal || '--'}</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>BMR</div>
                  <div style={{ ...styles.statVal, color: '#3b82f6' }}>{user?.bmr || '--'}</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Goal</div>
                  <div style={{ ...styles.statVal, color: '#f59e0b', fontSize: '14px' }}>{user?.weightGoal || '--'}</div>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>WATER INTAKE</div>
              <div style={styles.waterWrap}>
                {[1,2,3,4,5,6,7,8].map((glass) => (
                  <span
                    key={glass}
                    style={{ fontSize: '22px', opacity: glass <= (dailyLog?.waterIntake || 0) ? 1 : 0.25, cursor: 'pointer' }}
                    onClick={() => updateWater(glass)}
                  >💧</span>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {dailyLog?.waterIntake || 0} / 8 glasses
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  async function updateWater(glasses) {
    try {
      await API.put('/daily/water', { date: today, waterIntake: glasses })
      setDailyLog(prev => ({ ...prev, waterIntake: glasses }))
    } catch (err) {
      console.error(err)
    }
  }
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#f8f6ff' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '16px', color: 'var(--text-secondary)' },
  topbar: { background: '#fff', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' },
  greeting: { fontSize: '16px', fontWeight: '600', color: 'var(--dark)' },
  dateBadge: { fontSize: '13px', color: 'var(--text-secondary)', background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px' },
  content: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' },
  row2: { display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border)' },
  cardTitle: { fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: '1rem', fontWeight: '600' },
  ringWrap: { position: 'relative', width: '120px', height: '120px', margin: '0 auto 1rem' },
  ringCenter: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' },
  ringNum: { fontSize: '20px', fontWeight: '600', color: 'var(--dark)' },
  ringLabel: { fontSize: '11px', color: 'var(--text-secondary)' },
  ringStats: { display: 'flex', justifyContent: 'space-between' },
  ringStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  rsLabel: { fontSize: '11px', color: 'var(--text-secondary)' },
  rsVal: { fontSize: '14px', fontWeight: '600', color: 'var(--dark)' },
  macroLegend: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' },
  macroItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' },
  macroDot: { width: '8px', height: '8px', borderRadius: '50%' },
  macroName: { flex: 1, color: 'var(--text-secondary)' },
  macroVal: { fontWeight: '600', color: 'var(--dark)' },
  mealItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8f6ff', borderRadius: '10px', marginBottom: '8px' },
  mealLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  mealIcon: { fontSize: '20px' },
  mealName: { fontSize: '13px', fontWeight: '600', color: 'var(--dark)' },
  mealSub: { fontSize: '11px', color: 'var(--text-secondary)' },
  mealCal: { fontSize: '13px', fontWeight: '600', color: '#c084fc' },
  deleteBtn: { background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' },
  empty: { fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  statBox: { background: '#f8f6ff', borderRadius: '10px', padding: '10px 12px' },
  statLabel: { fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' },
  statVal: { fontSize: '18px', fontWeight: '600' },
  waterWrap: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' },
}

export default Dashboard