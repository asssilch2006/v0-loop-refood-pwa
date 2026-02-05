import { NextRequest, NextResponse } from 'next/server';

// Algerian food waste knowledge base for Groq AI
const KNOWLEDGE_BASE = {
  en: {
    breadWaste: '38% of household food waste in Algiers comes from bread and cereals due to improper storage',
    householdWaste: '45% of food waste occurs in urban households from overconsumption',
    co2Impact: 'Every kilogram of bread saved prevents 2.5kg of CO2 emissions',
    dryBreadRecycling: 'Our dry bread recycling program connects bakeries with livestock farmers to reduce waste',
    storageAdvice: 'Store bread in cool, dry places and use airtight containers to extend freshness',
  },
  fr: {
    breadWaste: '38% du gaspillage alimentaire ménager à Alger provient du pain et des céréales',
    householdWaste: '45% du gaspillage alimentaire se produit dans les ménages urbains',
    co2Impact: 'Chaque kilogramme de pain sauvegardé prévient 2,5 kg d\'émissions de CO2',
    dryBreadRecycling: 'Notre programme de recyclage du pain sec relie les boulangeries aux agriculteurs',
    storageAdvice: 'Conservez le pain dans des endroits frais et secs et utilisez des contenants hermétiques',
  },
  ar: {
    breadWaste: '38% من هدر الغذاء المنزلي في الجزائر يأتي من الخبز والحبوب',
    householdWaste: '45% من هدر الغذاء يحدث في الأسر الحضرية',
    co2Impact: 'كل كيلوجرام من الخبز المحفوظ يمنع 2.5 كغ من انبعاثات CO2',
    dryBreadRecycling: 'يربط برنامجنا لإعادة تدوير الخبز الجاف بين المخابز والمزارعين',
    storageAdvice: 'احفظ الخبز في أماكن باردة وجافة واستخدم حاويات محكمة الإغلاق',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { text, language = 'en', context = 'guidance' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.warn('[v0] GROQ_API_KEY not set - using fallback');
      return NextResponse.json({ message: text, audioUrl: '' });
    }

    const kb = KNOWLEDGE_BASE[language as keyof typeof KNOWLEDGE_BASE] || KNOWLEDGE_BASE.en;

    // Context-aware system prompts
    const systemPrompts = {
      guidance: `You are a helpful female voice assistant for Loop Refood, an Algerian app fighting food waste in Algiers.
You have access to this knowledge about food waste:
- ${kb.breadWaste}
- ${kb.householdWaste}
- ${kb.co2Impact}
- ${kb.dryBreadRecycling}
- ${kb.storageAdvice}

Provide concise, friendly, and actionable guidance. Keep responses under 100 words.`,

      accessibility: `You are an accessibility assistant for Loop Refood. Read the provided text clearly and naturally, suitable for screen readers.
Speak in a warm, encouraging tone. Use this knowledge base when relevant:
${Object.values(kb).join(' ')}`,

      news: `You are a food sustainability news assistant for Loop Refood. Provide brief, interesting updates about food waste reduction in Algeria.
Use this knowledge: ${Object.values(kb).join(' ')}`,
    };

    const systemPrompt = systemPrompts[context as keyof typeof systemPrompts] || systemPrompts.guidance;

    console.log('[v0] Generating voice guidance:', { text: text.substring(0, 50), language, context });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[v0] Groq API error:', error);
      return NextResponse.json(
        { message: text, audioUrl: '', error: 'Voice service unavailable' },
        { status: 200 }
      );
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content || text;

    console.log('[v0] Voice guidance generated:', message.substring(0, 80));

    return NextResponse.json({
      message,
      audioUrl: '',
      success: true,
    });
  } catch (error) {
    console.error('[v0] Voice guidance API error:', error);
    return NextResponse.json(
      { message: 'Voice service unavailable', audioUrl: '' },
      { status: 200 }
    );
  }
}
