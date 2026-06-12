const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  servingSize: { type: Number, default: 100 },
  servingUnit: { type: String, default: 'g' },
  isIndian: { type: Boolean, default: false },
  source: { type: String, enum: ['usda', 'indian', 'custom'], default: 'custom' }
}, { timestamps: true })

module.exports = mongoose.model('Food', foodSchema)