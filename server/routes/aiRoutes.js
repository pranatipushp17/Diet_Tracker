const express = require('express')
const router = express.Router()
const { analyzeMeal } = require('../controllers/aiController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/analyze', authMiddleware, analyzeMeal)

module.exports = router