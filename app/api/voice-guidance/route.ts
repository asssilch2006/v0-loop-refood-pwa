import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    console.log('[v0] Generating voice guidance for:', text.substring(0, 50));

    // Call Groq API for voice synthesis
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are an accessibility assistant. Read the provided text in a clear, natural way suitable for screen readers.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!groqResponse.ok) {
      console.error('[v0] Groq API error:', await groqResponse.text());
      // Return empty audioUrl if Groq fails - client will use Web Speech API fallback
      return NextResponse.json({ audioUrl: '' });
    }

    const data = await groqResponse.json();
    console.log('[v0] Voice guidance generated successfully');

    return NextResponse.json({
      audioUrl: '',
      message: data.choices[0]?.message?.content || '',
    });
  } catch (error) {
    console.error('[v0] Voice guidance API error:', error);
    return NextResponse.json(
      { audioUrl: '', error: 'Failed to generate voice guidance' },
      { status: 500 }
    );
  }
}
