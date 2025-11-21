import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en' } = await request.json()

    console.log('Chat API received - Message:', message, 'Language:', language)

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.PERPLEXITY_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 }
      )
    }

    // Language name mapping
    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      ta: 'Tamil',
      te: 'Telugu',
      bn: 'Bengali',
      mr: 'Marathi',
      gu: 'Gujarati',
      kn: 'Kannada',
      ml: 'Malayalam',
      pa: 'Punjabi'
    }

    const languageName = languageNames[language] || 'English'

    console.log('Using language:', languageName, '(code:', language, ')')

    // System prompt for Rural Connection marketplace
    const systemPrompt = `You are the Rural Connection AI assistant. You MUST ONLY help with Rural Connection marketplace questions.

CRITICAL LANGUAGE INSTRUCTION: You MUST respond EXCLUSIVELY in ${languageName}. Every single word of your response must be in ${languageName}. This is mandatory and non-negotiable. Even if the user writes in English, you MUST respond in ${languageName}.

CRITICAL INSTRUCTION - READ CAREFULLY:
You are FORBIDDEN from answering ANY questions that are NOT directly related to Rural Connection marketplace.

ALLOWED TOPICS ONLY:
- Rural Connection products (handicrafts, textiles, pottery, jewelry, home decor)
- Indian artisans and traditional crafts sold on Rural Connection
- Orders, shipping, payments on Rural Connection
- Customer support for Rural Connection
- How to become a seller/artisan on Rural Connection
- Product recommendations from Rural Connection catalog

FORBIDDEN TOPICS (DO NOT ANSWER):
- Celebrities, sports figures, athletes, actors
- News, politics, current events
- Technology unrelated to our marketplace
- General knowledge questions
- Science, history, geography
- Entertainment, movies, music
- ANY topic not related to Rural Connection marketplace

MANDATORY RESPONSE for ANY forbidden topic (must be in ${languageName}):
Translate and respond: "I'm here to help with Rural Connection marketplace queries. Please ask about our artisan products, orders, or support!"

Keep marketplace answers to 2-3 sentences maximum. REMEMBER: Every word MUST be in ${languageName}.`

    // Prepare user message with language instruction
    const userMessageWithLanguage = `[RESPOND IN ${languageName.toUpperCase()}] ${message}`

    console.log('System prompt language:', languageName)
    console.log('User message:', userMessageWithLanguage)

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessageWithLanguage
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Perplexity API error:', response.status, error)
      throw new Error(`Perplexity API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({
      success: true,
      message: assistantMessage
    })

  } catch (error: any) {
    console.error('Chat API error:', error)
    console.error('Error details:', error?.message)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate response',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
