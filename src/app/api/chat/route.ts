import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

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

    // System prompt for Rural Connection marketplace
    const systemPrompt = `You are the Rural Connection AI assistant - a helpful chatbot for an Indian rural artisan marketplace platform.

STRICT RULES:
1. ONLY answer questions about:
   - Rural Connection marketplace products (handicrafts, textiles, pottery, jewelry, home decor)
   - Indian artisans and their crafts
   - Orders, shipping, payments, and customer support
   - Traditional Indian craftsmanship and techniques
   - Product recommendations from our marketplace
   - How to become a seller/artisan on the platform

2. If asked about UNRELATED topics (celebrities, sports, news, politics, technology, general knowledge, etc.), IMMEDIATELY respond:
   "I'm here to help with Rural Connection marketplace queries. Please ask about our artisan products, orders, or support!"

3. Keep answers CONCISE (2-3 sentences maximum)

4. Always be helpful, friendly, and professional

5. Promote Rural Connection's mission: Empowering rural artisans and preserving traditional Indian crafts

KEY INFORMATION:
- Handmade traditional crafts from talented Indian artisans
- Products: textiles, pottery, jewelry, home decor, handicrafts
- Shipping across India (5-7 business days)
- UPI and PhonePe payment accepted
- Customers can register as sellers/artisans via "Become an Artisan" page
- Mission: Support rural communities and preserve traditional craftsmanship

Remember: STRICTLY refuse to answer non-marketplace topics. Politely redirect every time.`

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
            content: message
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
