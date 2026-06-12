const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, age, gender, height, weight, activityLevel, weightGoal } = req.body

    // check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // password hash karo
    const hashedPassword = await bcrypt.hash(password, 10)

    // user banao
    const user = await User.create({
      name, email,
      password: hashedPassword,
      age, gender, height, weight,
      activityLevel, weightGoal,
      dailyCalorieGoal: 2000
    })

    const token = generateToken(user)

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        activityLevel: user.activityLevel,
        weightGoal: user.weightGoal,
        dailyCalorieGoal: user.dailyCalorieGoal,
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user)

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        activityLevel: user.activityLevel,
        weightGoal: user.weightGoal,
        dailyCalorieGoal: user.dailyCalorieGoal,
        bmi: user.bmi,
        bmr: user.bmr,
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { register, login }