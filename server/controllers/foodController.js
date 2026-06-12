const Food = require('../models/Food')
const indianFoods = require('../data/indianFoods')
const axios = require('axios')

// USDA food search
const searchFood = async (req, res) => {
  try {
    const { q } = req.query
    
    // pehle Indian DB mein search karo
    const indianResults = indianFoods.filter(f => 
      f.name.toLowerCase().includes(q.toLowerCase())
    )
    
    if (indianResults.length > 0) {
      return res.json(indianResults)
    }

    // phir USDA API mein search karo
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${q}&api_key=DEMO_KEY&pageSize=8`
    )

    const foods = response.data.foods.map(food => ({
      _id: food.fdcId.toString(),
      name: food.description,
      calories: food.foodNutrients?.find(n => n.nutrientName === 'Energy')?.value || 0,
      protein: food.foodNutrients?.find(n => n.nutrientName === 'Protein')?.value || 0,
      carbs: food.foodNutrients?.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
      fat: food.foodNutrients?.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0,
      servingSize: 100,
      servingUnit: 'g',
      source: 'usda'
    }))

    res.json(foods)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Indian foods list
const getIndianFoods = async (req, res) => {
  res.json(indianFoods)
}

// Custom food add karo
const addCustomFood = async (req, res) => {
  try {
    const food = await Food.create({ ...req.body, source: 'custom' })
    res.status(201).json(food)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { searchFood, getIndianFoods, addCustomFood }