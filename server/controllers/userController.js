const User = require('../models/User')

// GET profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// UPDATE profile
const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { ...req.body },
      { new: true }
    ).select('-password')
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET BMI + TDEE
const getBMI = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const h = user.height / 100
    const w = user.weight
    const age = user.age

    const bmi = w / (h * h)

    let bmr
    if (user.gender === 'female') {
      bmr = 447.593 + (9.247 * w) + (3.098 * user.height) - (4.330 * age)
    } else {
      bmr = 88.362 + (13.397 * w) + (4.799 * user.height) - (5.677 * age)
    }

    const multipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725
    }

    const tdee = bmr * multipliers[user.activityLevel]

    res.json({
      bmi: parseFloat(bmi.toFixed(1)),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getProfile, updateProfile, getBMI }