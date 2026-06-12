const mongoose = require('mongoose')

const dailyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 },
}, { timestamps: true })

// ek user ka ek din mein sirf ek log
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('DailyLog', dailyLogSchema)