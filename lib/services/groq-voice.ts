// Groq AI Voice Service for Accessibility
// This service provides AI-powered voice guidance for visually impaired users

export async function generateVoiceGuidance(text: string): Promise<string> {
  // This would integrate with Groq's API for natural speech synthesis
  // For now, we'll use the Web Speech API as fallback
  
  try {
    const response = await fetch('/api/voice-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error('Failed to generate voice guidance');
    
    const data = await response.json();
    return data.audioUrl || '';
  } catch (error) {
    console.error('[v0] Voice guidance error:', error);
    // Fallback to Web Speech API
    return await generateWebSpeech(text);
  }
}

// Fallback: Web Speech API for immediate voice feedback
export async function generateWebSpeech(text: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve('');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2; // Female voice pitch

    // Find female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.includes('Google UK English Female')
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
    resolve('');
  });
}

// Groq Model Configuration
export const GROQ_CONFIG = {
  model: 'mixtral-8x7b-32768',
  temperature: 0.7,
  maxTokens: 500,
};

// Voice guidance prompts
export const VOICE_PROMPTS = {
  screenReader: 'Please read the entire visible content on the screen for screen reader users.',
  navigation: 'Describe the current navigation options available.',
  itemDetails: 'Provide detailed information about the selected food item for accessibility.',
  priceComparison: 'Compare the original and loop prices and describe the discount.',
};
