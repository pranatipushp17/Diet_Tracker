import { useState, useEffect } from 'react'
import API from '../api/axios'

function History() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthLogs, setMonthLogs] = useState({})
  const [dayDetail, setDayDetail] = useState(null)

  useEffect(() => {
    fetchMonthData()
  }, [currentMonth])

  const fetchMonthData = async () => {
    try {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth() + 1
      const res = await API.get(`/daily/month?year=${year}&month=${month}`)
      const logsMap = {}
      res.data.forEach(log => {
        logsMap[log.date] = log
      })
      setMonthLogs(logsMap)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchDayDetail = async (dateStr) => {
    try {
      const [mealsRes, dailyRes] = await Promise.all([
        API.get(`/meals/${dateStr}`),
        API.get(`/daily/${dateStr}`)
      ])
      setDayDetail({ meals: mealsRes.data, daily: dailyRes.data })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr)
    fetchDayDetail(dateStr)
  }

  const getDotColor = (date) => {
    const log = monthLogs[date]
    if (!log) return null
    const goal = 2000
    if (log.totalCalories <= goal) return '#10b981'
    if (log.totalCalories <= goal * 1.1) return '#f59e0b'
    return '#ef4444'
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth()
  const today = new Date().toISOString().split('T')[0]

  const formatDate = (day) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}-${String(day).padStart(2, '0')}`
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    setSelectedDate(null)
    setDayDetail(null)
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    setSelectedDate(null)
    setDayDetail(null)
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const mealIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snacks: '🍎'
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div style={styles.title}>Meal History</div>
        <div style={styles.legend}>
          <div style={styles.legItem}><div style={{ ...styles.legDot, background: '#10b981' }}></div>Under goal</div>
          <div style={styles.legItem}><div style={{ ...styles.legDot, background: '#f59e0b' }}></div>Near goal</div>
          <div style={styles.legItem}><div style={{ ...styles.legDot, background: '#ef4444' }}></div>Over goal</div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.left}>

          {/* Calendar */}
          <div style={styles.card}>
            <div style={styles.calHeader}>
              <button style={styles.navBtn} onClick={prevMonth}>←</button>
              <div style={styles.monthName}>{monthName}</div>
              <button style={styles.navBtn} onClick={nextMonth}>→</button>
            </div>

            <div style={styles.calGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} style={styles.dayHeader}>{d}</div>
              ))}

              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1
                const dateStr = formatDate(day)
                const dotColor = getDotColor(dateStr)
                const isToday = dateStr === today
                const isSelected = dateStr === selectedDate

                return (
                  <div
                    key={day}
                    style={{
                      ...styles.calDay,
                      ...(isToday ? styles.calToday : {}),
                      ...(isSelected ? styles.calSelected : {}),
                    }}
                    onClick={() => handleDayClick(dateStr)}
                  >
                    {day}
                    {dotColor && !isToday && (
                      <div style={{ ...styles.dot, background: dotColor }}></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Day Detail */}
        <div style={styles.right}>
          {dayDetail ? (
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                {new Date(selectedDate + 'T00:00:00').toDateString()}
              </div>

              {dayDetail.meals.length === 0 ? (
                <div style={styles.empty}>No meals logged this day</div>
              ) : (
                <>
                  {dayDetail.meals.map(meal => (
                    <div key={meal._id} style={styles.mealItem}>
                      <div style={styles.mealLeft}>
                        <span style={styles.mealIcon}>{mealIcons[meal.mealType]}</span>
                        <div>
                          <div style={styles.mealName}>
                            {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                          </div>
                          <div style={styles.mealFoods}>
                            {meal.foods.map(f => f.name).join(', ')}
                          </div>
                        </div>
                      </div>
                      <div style={styles.mealCal}>{meal.totalCalories} kcal</div>
                    </div>
                  ))}

                  <div style={styles.divider}></div>

                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total calories</span>
                    <span style={styles.totalVal}>{dayDetail.daily?.totalCalories || 0} kcal</span>
                  </div>

                  <div style={styles.macroRow}>
                    <div style={styles.macroChip}>
                      <div style={styles.macroLabel}>Protein</div>
                      <div style={{ ...styles.macroVal, color: '#3b82f6' }}>{dayDetail.daily?.totalProtein || 0}g</div>
                    </div>
                    <div style={styles.macroChip}>
                      <div style={styles.macroLabel}>Carbs</div>
                      <div style={{ ...styles.macroVal, color: '#f59e0b' }}>{dayDetail.daily?.totalCarbs || 0}g</div>
                    </div>
                    <div style={styles.macroChip}>
                      <div style={styles.macroLabel}>Fat</div>
                      <div style={{ ...styles.macroVal, color: '#ec4899' }}>{dayDetail.daily?.totalFat || 0}g</div>
                    </div>
                    <div style={styles.macroChip}>
                      <div style={styles.macroLabel}>Water</div>
                      <div style={{ ...styles.macroVal, color: '#06b6d4' }}>{dayDetail.daily?.waterIntake || 0} 💧</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyEmoji}>📅</div>
              <div style={styles.emptyText}>Koi din select karo detail dekhne ke liye!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#f8f6ff' },
  topbar: { background: '#fff', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '16px', fontWeight: '600', color: 'var(--dark)' },
  legend: { display: 'flex', gap: '16px' },
  legItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' },
  legDot: { width: '8px', height: '8px', borderRadius: '50%' },
  content: { padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  left: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  right: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border)' },
  cardTitle: { fontSize: '13px', fontWeight: '600', color: 'var(--dark)', marginBottom: '1rem' },
  calHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  navBtn: { background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '14px', color: 'var(--dark)' },
  monthName: { fontSize: '15px', fontWeight: '600', color: 'var(--dark)' },
  calGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' },
  dayHeader: { fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', padding: '4px 0', fontWeight: '500' },
  calDay: { aspectRatio: '1', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '500', cursor: 'pointer', color: 'var(--dark)', background: '#f8f6ff', position: 'relative' },
  calToday: { background: '#c084fc', color: '#fff' },
  calSelected: { background: '#ede9fe', border: '1.5px solid #c084fc', color: '#7c3aed' },
  dot: { width: '5px', height: '5px', borderRadius: '50%', position: 'absolute', bottom: '3px' },
  mealItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8f6ff', borderRadius: '10px', marginBottom: '8px' },
  mealLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  mealIcon: { fontSize: '20px' },
  mealName: { fontSize: '13px', fontWeight: '600', color: 'var(--dark)' },
  mealFoods: { fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' },
  mealCal: { fontSize: '13px', fontWeight: '600', color: '#c084fc' },
  divider: { height: '1px', background: 'var(--border)', margin: '8px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' },
  totalLabel: { fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' },
  totalVal: { fontSize: '16px', fontWeight: '700', color: '#10b981' },
  macroRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '8px' },
  macroChip: { background: '#f8f6ff', borderRadius: '8px', padding: '8px', textAlign: 'center' },
  macroLabel: { fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' },
  macroVal: { fontSize: '14px', fontWeight: '600' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' },
  emptyEmoji: { fontSize: '48px' },
  emptyText: { fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' },
  empty: { fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' },
}

export default History