const Groq = require('groq-sdk')

const analyzeMeal = async (req, res) => {
  try {
    const { text } = req.body
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: `You are a nutrition expert. Analyze this meal and return ONLY pure JSON, no markdown, no extra text.
Meal: "${text}"
Return exactly: {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "summary": "brief description"}`
      }],
      temperature: 0.3,
    })

    const response = completion.choices[0].message.content
    const cleaned = response.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    res.json(parsed)
  } catch (err) {
    console.log('AI Error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { analyzeMeal }