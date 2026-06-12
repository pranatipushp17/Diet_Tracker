const express = require('express')
const router = express.Router()
const { searchFood, getIndianFoods, addCustomFood } = require('../controllers/foodController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/search', authMiddleware, searchFood)
router.get('/indian', authMiddleware, getIndianFoods)
router.post('/custom', authMiddleware, addCustomFood)

module.exports = router