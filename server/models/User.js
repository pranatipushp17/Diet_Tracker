const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['male', 'female'] },
  height: Number,
  weight: Number,
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'],
    default: 'lightly_active'
  },
  weightGoal: {
    type: String,
    enum: ['lose', 'maintain', 'gain'],
    default: 'maintain'
  },
  dailyCalorieGoal: { type: Number, default: 2000 },
  bmi: Number,
  bmr: Number,
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)