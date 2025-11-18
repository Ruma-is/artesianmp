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
    const systemPrompt = `You are a helpful customer service assistant for Rural Connection, an online marketplace that sells authentic handmade products from talented artisans across India. 

Your role is to:
- Help customers with product inquiries
- Provide information about orders and shipping
- Answer questions about artisans and their crafts
- Assist with general marketplace questions
- Be friendly, professional, and supportive

Key information about Rural Connection:
- We sell handmade, traditional crafts from Indian artisans
- Products include textiles, pottery, jewelry, home decor, and more
- We support rural artisans and preserve traditional craftsmanship
- Shipping across India with standard delivery
- UPI payment accepted
- Customers can become sellers/artisans by registering

Keep responses concise, helpful, and warm.`

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
