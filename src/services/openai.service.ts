// import OpenAI from 'openai'
// import { config } from '../config/config'

// const openai = new OpenAI({
//   apiKey: config.openaiApiKey,
// })

// export async function generateDescription(gameName: string): Promise<string> {
//   console.log('openai.apiKey:', config.openaiApiKey)
//   const prompt = `Write a short, engaging description (2-3 sentences) for a board game called "${gameName}".`

//   const res = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: prompt }],
//     temperature: 0.8,
//   })

//   return res.choices[0].message.content?.trim() || ''
// }
