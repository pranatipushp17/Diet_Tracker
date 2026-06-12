import { useState } from 'react'
import API from '../api/axios'

function AIAnalyzer() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Namaste! 🙏 Tell me what you ate — Hindi, English, ya Hinglish mein — main calories nikaal dunga!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mealType, setMealType] = useState('lunch')

  const examplePrompts = [
    'maine 2 paratha ghee ke saath khaya',
    '1 plate chole bhature + lassi',
    'breakfast mein upma aur ek egg',
    'I had a bowl of oats with milk',
    'snacks: 2 biscuits aur chai',
  ]

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await API.post('/ai/analyze', { text: userMsg })
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Got it! Here's the breakdown 👇`,
        result: res.data
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Kuch error aa gaya, dobara try karo! 😅'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleLog = async (result, text) => {
    try {
      await API.post('/meals', {
        mealType,
        date: new Date().toISOString().split('T')[0],
        foods: [{ name: text, calories: result.calories, protein: result.protein, carbs: result.carbs, fat: result.fat, quantity: 1 }],
        totalCalories: result.calories
      })
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `✓ Logged to ${mealType}! Dashboard pe check karo 🎉`
      }])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div style={styles.title}>AI Meal Analyzer</div>
        <div style={styles.geminiBadge}>✦ Powered by Gemini</div>
      </div>

      <div style={styles.content}>
        {/* Left: Chat */}
        <div style={styles.chatWrap}>
          <div style={styles.chatBox}>
            {messages.map((msg, i) => (
              <div key={i} style={{ ...styles.msgRow, ...(msg.role === 'user' ? styles.msgRowUser : {}) }}>
                <div style={{ ...styles.avatar, ...(msg.role === 'user' ? styles.avatarUser : styles.avatarAi) }}>
                  {msg.role === 'ai' ? '🤖' : '👤'}
                </div>
                <div style={{ maxWidth: '85%' }}>
                  <div style={{ ...styles.bubble, ...(msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi) }}>
                    {msg.text}
                  </div>
                  {msg.result && (
                    <div style={styles.resultCard}>
                      <div style={styles.calRow}>
                        <span style={styles.calLabel}>Total calories</span>
                        <span style={styles.calVal}>{msg.result.calories} kcal</span>
                      </div>
                      <div style={styles.macroRow}>
                        <div style={styles.macroChip}>
                          <div style={styles.macroLabel}>Protein</div>
                          <div style={{ ...styles.macroVal, color: '#3b82f6' }}>{msg.result.protein}g</div>
                        </div>
                        <div style={styles.macroChip}>
                          <div style={styles.macroLabel}>Carbs</div>
                          <div style={{ ...styles.macroVal, color: '#f59e0b' }}>{msg.result.carbs}g</div>
                        </div>
                        <div style={styles.macroChip}>
                          <div style={styles.macroLabel}>Fat</div>
                          <div style={{ ...styles.macroVal, color: '#ec4899' }}>{msg.result.fat}g</div>
                        </div>
                      </div>
                      <div style={styles.logRow}>
                        <select
                          style={styles.mealSelect}
                          value={mealType}
                          onChange={e => setMealType(e.target.value)}
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="snacks">Snacks</option>
                        </select>
                        <button
                          style={styles.logBtn}
                          onClick={() => handleLog(msg.result, messages[i - 1]?.text)}
                        >
                          Add to log ✓
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={styles.msgRow}>
                <div style={{ ...styles.avatar, ...styles.avatarAi }}>🤖</div>
                <div style={{ ...styles.bubble, ...styles.bubbleAi }}>Analyzing... ✦</div>
              </div>
            )}
          </div>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="maine 2 roti aur ek bowl dal khaya..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button style={styles.sendBtn} onClick={handleSend}>✦</button>
          </div>
        </div>

        {/* Right: Examples + Tips */}
        <div style={styles.rightPanel}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>TRY THESE PROMPTS</div>
            <div style={styles.exampleList}>
              {examplePrompts.map((p, i) => (
                <div
                  key={i}
                  style={styles.exChip}
                  onClick={() => setInput(p)}
                >
                  <span>{p}</span>
                  <span style={{ color: '#c084fc' }}>↗</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>HOW IT WORKS</div>
            <div style={styles.tipList}>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>💬</span>
                <div>
                  <div style={styles.tipTitle}>Type naturally</div>
                  <div style={styles.tipSub}>Hindi, English, Hinglish sab chalega</div>
                </div>
              </div>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>✦</span>
                <div>
                  <div style={styles.tipTitle}>Gemini AI analyzes</div>
                  <div style={styles.tipSub}>Calories + macros estimate karta hai</div>
                </div>
              </div>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>➕</span>
                <div>
                  <div style={styles.tipTitle}>One tap to log</div>
                  <div style={styles.tipSub}>Direct meal diary mein save hoga</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#f8f6ff', display: 'flex', flexDirection: 'column' },
  topbar: { background: '#fff', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '16px', fontWeight: '600', color: 'var(--dark)' },
  geminiBadge: { fontSize: '12px', background: '#ede9fe', color: '#7c3aed', padding: '4px 12px', borderRadius: '20px' },
  content: { padding: '1.5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem', flex: 1 },
  chatWrap: { display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', borderRadius: '14px', border: '1px solid var(--border)', padding: '1.25rem' },
  chatBox: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '350px', overflowY: 'auto' },
  msgRow: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 },
  avatarAi: { background: 'linear-gradient(135deg, #c084fc, #818cf8)' },
  avatarUser: { background: 'linear-gradient(135deg, #FF6B9D, #FFB347)' },
  bubble: { padding: '10px 14px', borderRadius: '12px', fontSize: '13px', lineHeight: 1.5 },
  bubbleAi: { background: '#f8f6ff', color: 'var(--dark)', borderBottomLeftRadius: '4px' },
  bubbleUser: { background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', borderBottomRightRadius: '4px' },
  resultCard: { background: '#faf5ff', border: '1px solid #c084fc33', borderRadius: '10px', padding: '10px 12px', marginTop: '6px' },
  calRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  calLabel: { fontSize: '12px', color: 'var(--text-secondary)' },
  calVal: { fontSize: '20px', fontWeight: '700', color: '#7c3aed' },
  macroRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' },
  macroChip: { background: '#fff', borderRadius: '8px', padding: '6px 8px', textAlign: 'center', border: '1px solid var(--border)' },
  macroLabel: { fontSize: '10px', color: 'var(--text-secondary)' },
  macroVal: { fontSize: '14px', fontWeight: '600' },
  logRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  mealSelect: { flex: 1, padding: '7px 10px', borderRadius: '7px', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--dark)', background: '#fff' },
  logBtn: { background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' },
  inputRow: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '13px', color: 'var(--dark)', background: '#fff' },
  sendBtn: { width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #c084fc, #818cf8)', color: '#fff', fontSize: '18px', border: 'none', cursor: 'pointer' },
  rightPanel: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border)' },
  cardTitle: { fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.06em', fontWeight: '600', marginBottom: '1rem' },
  exampleList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  exChip: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8f6ff', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', border: '1px solid var(--border)' },
  tipList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  tipItem: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  tipIcon: { fontSize: '18px', flexShrink: 0 },
  tipTitle: { fontSize: '13px', fontWeight: '500', color: 'var(--dark)' },
  tipSub: { fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' },
}

export default AIAnalyzer