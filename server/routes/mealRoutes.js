const express = require('express')
const router = express.Router()
const { addMeal, getMealsByDate, deleteMeal } = require('../controllers/mealController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, addMeal)
router.get('/:date', authMiddleware, getMealsByDate)
router.delete('/:id', authMiddleware, deleteMeal)

module.exports = router