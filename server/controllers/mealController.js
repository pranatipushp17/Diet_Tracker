const MealLog = require('../models/MealLog')
const DailyLog = require('../models/DailyLog')

// Meal add karo
const addMeal = async (req, res) => {
  try {
    console.log('Request body:', req.body)
    console.log('User:', req.user)
    const { mealType, date, foods, totalCalories } = req.body
    const userId = req.user.id

    const meal = await MealLog.create({
      userId, mealType, date, foods, totalCalories
    })

    await updateDailyLog(userId, date)

    res.status(201).json(meal)
  } catch (err) {
    console.log('Error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// Ek din ke meals fetch karo
const getMealsByDate = async (req, res) => {
  try {
    const meals = await MealLog.find({
      userId: req.user.id,
      date: req.params.date
    })
    res.json(meals)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Meal delete karo
const deleteMeal = async (req, res) => {
  try {
    await MealLog.findByIdAndDelete(req.params.id)
    res.json({ message: 'Meal deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DailyLog automatically update karo
const updateDailyLog = async (userId, date) => {
  const meals = await MealLog.find({ userId, date })

  const totals = meals.reduce((acc, meal) => {
    acc.totalCalories += meal.totalCalories || 0
    meal.foods.forEach(f => {
      acc.totalProtein += parseFloat(f.protein) || 0
      acc.totalCarbs += parseFloat(f.carbs) || 0
      acc.totalFat += parseFloat(f.fat) || 0
    })
    return acc
  }, { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 })

  // Round to 1 decimal
  totals.totalProtein = Math.round(totals.totalProtein * 10) / 10
  totals.totalCarbs = Math.round(totals.totalCarbs * 10) / 10
  totals.totalFat = Math.round(totals.totalFat * 10) / 10

  await DailyLog.findOneAndUpdate(
    { userId, date },
    { $set: { ...totals } },
    { upsert: true, new: true }
  )
}

module.exports = { addMeal, getMealsByDate, deleteMeal }