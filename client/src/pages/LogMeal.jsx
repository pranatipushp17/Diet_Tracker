import { useState } from 'react'
import API from '../api/axios'

function LogMeal() {
  const [mealType, setMealType] = useState('breakfast')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [addedFoods, setAddedFoods] = useState([])
  const [aiText, setAiText] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks']

  const handleSearch = async (e) => {
    setSearch(e.target.value)
    if (e.target.value.length < 2) return setSearchResults([])
    try {
      const res = await API.get(`/food/search?q=${e.target.value}`)
      setSearchResults(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const addFood = (food) => {
    const exists = addedFoods.find(f => f._id === food._id)
    if (exists) {
      setAddedFoods(addedFoods.map(f =>
        f._id === food._id ? { ...f, quantity: f.quantity + 1 } : f
      ))
    } else {
      setAddedFoods([...addedFoods, { ...food, quantity: 1 }])
    }
    setSearch('')
    setSearchResults([])
  }

  const updateQty = (id, delta) => {
    setAddedFoods(addedFoods
      .map(f => f._id === id ? { ...f, quantity: f.quantity + delta } : f)
      .filter(f => f.quantity > 0)
    )
  }

  const totalCalories = addedFoods.reduce((sum, f) => sum + f.calories * f.quantity, 0)

  const handleSave = async () => {
    if (addedFoods.length === 0) return
    setLoading(true)
    try {
      await API.post('/meals', {
        mealType,
        date: new Date().toISOString().split('T')[0],
        foods: addedFoods.map(f => ({
          foodId: f._id,
          name: f.name,
          quantity: f.quantity,
          calories: f.calories * f.quantity
        })),
        totalCalories
      })
      setAddedFoods([])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAiAnalyze = async () => {
    if (!aiText.trim()) return
    setAiLoading(true)
    try {
      const res = await API.post('/ai/analyze', { text: aiText })
      setAiResult(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }

  const addAiResult = () => {
    if (!aiResult) return
    setAddedFoods([...addedFoods, {
      _id: Date.now().toString(),
      name: aiText,
      calories: aiResult.calories,
      protein: aiResult.protein,
      carbs: aiResult.carbs,
      fat: aiResult.fat,
      quantity: 1
    }])
    setAiText('')
    setAiResult(null)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div style={styles.title}>Log Meal</div>
        <div style={styles.dateBadge}>{new Date().toDateString()}</div>
      </div>

      <div style={styles.content}>
        <div style={styles.left}>

          {/* Meal Type */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>MEAL TYPE</div>
            <div style={styles.pills}>
              {mealTypes.map(type => (
                <button
                  key={type}
                  style={{ ...styles.pill, ...(mealType === type ? styles.pillActive : {}) }}
                  onClick={() => setMealType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Food Search */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>SEARCH FOOD</div>
            <input
              style={styles.searchInput}
              placeholder="Search dal, roti, paneer, chicken..."
              value={search}
              onChange={handleSearch}
            />
            {searchResults.length > 0 && (
              <div style={styles.results}>
                {searchResults.map(food => (
                  <div key={food._id} style={styles.resultRow}>
                    <div>
                      <div style={styles.foodName}>{food.name}</div>
                      <div style={styles.foodMeta}>{food.servingSize}{food.servingUnit}</div>
                    </div>
                    <div style={styles.resultRight}>
                      <div style={styles.calBadge}>{food.calories} kcal</div>
                      <button style={styles.addBtn} onClick={() => addFood(food)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Analyzer */}
          <div style={styles.aiCard}>
            <div style={styles.cardTitle}>🤖 AI MEAL ANALYZER</div>
            <div style={styles.aiInputRow}>
              <input
                style={styles.aiInput}
                placeholder="maine 2 roti aur ek bowl dal khaya..."
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
              />
              <button style={styles.aiBtn} onClick={handleAiAnalyze} disabled={aiLoading}>
                {aiLoading ? '...' : '✦'}
              </button>
            </div>
            {aiResult && (
              <div style={styles.aiResult}>
                <div style={styles.aiCalRow}>
                  <span style={styles.aiCalLabel}>Estimated calories</span>
                  <span style={styles.aiCalVal}>{aiResult.calories} kcal</span>
                </div>
                <div style={styles.aiMacros}>
                  <span style={{ color: '#3b82f6' }}>P: {aiResult.protein}g</span>
                  <span style={{ color: '#f59e0b' }}>C: {aiResult.carbs}g</span>
                  <span style={{ color: '#ec4899' }}>F: {aiResult.fat}g</span>
                </div>
                <button style={styles.addAiBtn} onClick={addAiResult}>Add to meal →</button>
              </div>
            )}
          </div>

        </div>

        {/* Right: Added Foods */}
        <div style={styles.right}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)} — Added foods
            </div>

            {addedFoods.length === 0 ? (
              <div style={styles.empty}>Search aur food add karo 👈</div>
            ) : (
              addedFoods.map(food => (
                <div key={food._id} style={styles.addedItem}>
                  <div>
                    <div style={styles.addedName}>{food.name}</div>
                    <div style={styles.addedSub}>{food.calories * food.quantity} kcal</div>
                  </div>
                  <div style={styles.qtyControl}>
                    <button style={styles.qtyBtn} onClick={() => updateQty(food._id, -1)}>−</button>
                    <span style={styles.qtyVal}>{food.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQty(food._id, 1)}>+</button>
                  </div>
                </div>
              ))
            )}

            {addedFoods.length > 0 && (
              <>
                <div style={styles.totalBar}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalVal}>{totalCalories} kcal</span>
                </div>
                <button style={styles.saveBtn} onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : saved ? '✓ Saved!' : `Save ${mealType}`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#f8f6ff' },
  topbar: { background: '#fff', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' },
  title: { fontSize: '16px', fontWeight: '600', color: 'var(--dark)' },
  dateBadge: { fontSize: '13px', color: 'var(--text-secondary)', background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px' },
  content: { padding: '1.5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' },
  left: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  right: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border)' },
  cardTitle: { fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: '1rem', fontWeight: '600' },
  pills: { display: 'flex', gap: '8px' },
  pill: { padding: '7px 16px', borderRadius: '20px', fontSize: '13px', border: '1px solid var(--border)', background: '#fff', color: 'var(--text-secondary)', cursor: 'pointer' },
  pillActive: { background: '#c084fc', color: '#fff', border: '1px solid #c084fc' },
  searchInput: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '14px', color: 'var(--dark)', background: '#fff' },
  results: { marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' },
  resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8f6ff', borderRadius: '8px' },
  foodName: { fontSize: '13px', fontWeight: '500', color: 'var(--dark)' },
  foodMeta: { fontSize: '11px', color: 'var(--text-secondary)' },
  resultRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  calBadge: { fontSize: '12px', fontWeight: '500', color: '#7c3aed', background: '#ede9fe', padding: '3px 8px', borderRadius: '6px' },
  addBtn: { width: '26px', height: '26px', borderRadius: '6px', background: '#c084fc', color: '#fff', fontSize: '16px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  aiCard: { background: '#faf5ff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #c084fc44' },
  aiInputRow: { display: 'flex', gap: '8px' },
  aiInput: { flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #c084fc55', fontSize: '13px', color: 'var(--dark)', background: '#fff' },
  aiBtn: { width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', fontSize: '18px', cursor: 'pointer', border: 'none' },
  aiResult: { marginTop: '10px', background: '#fff', borderRadius: '10px', padding: '10px 12px', border: '1px solid #c084fc33' },
  aiCalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  aiCalLabel: { fontSize: '12px', color: 'var(--text-secondary)' },
  aiCalVal: { fontSize: '18px', fontWeight: '600', color: '#7c3aed' },
  aiMacros: { display: 'flex', gap: '12px', fontSize: '13px', fontWeight: '500', marginBottom: '8px' },
  addAiBtn: { background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' },
  addedItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8f6ff', borderRadius: '10px', marginBottom: '8px' },
  addedName: { fontSize: '13px', fontWeight: '500', color: 'var(--dark)' },
  addedSub: { fontSize: '11px', color: '#c084fc', fontWeight: '500' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: { width: '24px', height: '24px', borderRadius: '6px', background: '#fff', border: '1px solid var(--border)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark)' },
  qtyVal: { fontSize: '13px', fontWeight: '600', color: 'var(--dark)', minWidth: '16px', textAlign: 'center' },
  totalBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ede9fe', borderRadius: '8px', padding: '10px 12px', margin: '8px 0' },
  totalLabel: { fontSize: '13px', color: '#7c3aed', fontWeight: '500' },
  totalVal: { fontSize: '18px', fontWeight: '600', color: '#7c3aed' },
  saveBtn: { width: '100%', background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', padding: '11px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' },
  empty: { fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' },
}

export default LogMeal
