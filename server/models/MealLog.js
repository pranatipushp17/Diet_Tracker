const mongoose = require('mongoose')

const mealLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    required: true
  },
  foods: [{
    foodId: { type: String },
    name: String,
    quantity: { type: Number, default: 1 },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  }],
  totalCalories: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('MealLog', mealLogSchema)