const { GoogleGenerativeAI } = require('@google/generative-ai')

const analyzeMeal = async (req, res) => {
  try {
    const { text } = req.body
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a nutrition expert. Analyze this meal and return ONLY pure JSON, no markdown, no extra text.
Meal: "${text}"
Return exactly: {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "summary": "brief description"}`

    let result
    for (let i = 0; i < 3; i++) {
      try {
        result = await model.generateContent(prompt)
        break
      } catch (err) {
        if (i === 2) throw err
        await new Promise(r => setTimeout(r, 2000))
      }
    }

    const response = result.response.text()
    const cleaned = response.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    res.json(parsed)
  } catch (err) {
    console.log('AI Error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { analyzeMeal }