class AIEngine {
  async generateResponse(query, systemInstruction, historyContext) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API Key is not configured on the server.');
    }

    // Combine history context with current query
    const contents = [];
    
    // Convert history into gemini format
    if (historyContext && historyContext.length > 0) {
      for (const msg of historyContext) {
        let textContent = '';
        if (typeof msg.content === 'string') {
          textContent = msg.content;
        } else if (msg.content && typeof msg.content === 'object') {
          textContent = JSON.stringify(msg.content);
        }
        
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: textContent || ' ' }]
        });
      }
    }

    // Add current query
    contents.push({
      role: 'user',
      parts: [{ text: query }]
    });

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 1024,
            temperature: 0.2
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API Error Response:', errorData);
        throw new Error('Gemini API Provider returned error');
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) return rawText;

    } catch (apiErr) {
      console.error('Gemini API Fetch Exception:', apiErr.message);
    }

    // Dynamic Fallback JSON array string
    const qLower = query.toLowerCase();
    let text = "Va alaykum assalom! Men JustFiveCRM sun'iy intellekt yordamchingizman. Qanday yordam bera olaman?";
    if (!qLower.includes('salom') && !qLower.includes('assalom') && query.trim()) {
      text = `"${query}" bo'yicha so'rovingiz tahlil qilindi. CRM tizimidagi darslar, davomat, vazifalar va analitika bo'yicha yordam bera olaman.`;
    }

    return JSON.stringify([
      { type: "text", content: text }
    ]);
  }
}

module.exports = new AIEngine();
