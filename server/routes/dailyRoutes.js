const express = require('express')
const router = express.Router()
const { getDailyLog, updateWater, getWeeklyData, getMonthData } = require('../controllers/dailyController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/weekly', authMiddleware, getWeeklyData)
router.get('/month', authMiddleware, getMonthData)
router.get('/:date', authMiddleware, getDailyLog)
router.put('/water', authMiddleware, updateWater)

module.exports = router