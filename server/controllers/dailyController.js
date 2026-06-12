const DailyLog = require('../models/DailyLog')

// Ek din ka log fetch karo
const getDailyLog = async (req, res) => {
  try {
    const log = await DailyLog.findOne({
      userId: req.user.id,
      date: req.params.date
    })
    res.json(log || {})
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Water intake update karo
const updateWater = async (req, res) => {
  try {
    const { date, waterIntake } = req.body
    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user.id, date },
      { waterIntake },
      { upsert: true, new: true }
    )
    res.json(log)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Weekly data fetch karo (last 7 days)
const getWeeklyData = async (req, res) => {
  try {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }

    const logs = await DailyLog.find({
      userId: req.user.id,
      date: { $in: days }
    })

    const result = days.map(day => {
      const log = logs.find(l => l.date === day)
      return {
        day: new Date(day).toLocaleDateString('en', { weekday: 'short' }),
        calories: log?.totalCalories || 0,
        date: day
      }
    })

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Month ka data fetch karo (history page ke liye)
const getMonthData = async (req, res) => {
  try {
    const { year, month } = req.query
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`

    const logs = await DailyLog.find({
      userId: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    })

    res.json(logs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getDailyLog, updateWater, getWeeklyData, getMonthData }