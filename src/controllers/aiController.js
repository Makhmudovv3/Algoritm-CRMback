const { validationResult } = require('express-validator');
const aiEngine = require('../modules/ai/engine');
const promptBuilder = require('../modules/ai/promptBuilder');
const aiMemory = require('../modules/ai/memory');
const aiSecurity = require('../modules/ai/security');

class AiController {
  async chat(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { query, history, user, currentRole, path } = req.body;
      const userId = user?.id || req.user?.id || 'anonymous';

      // 1. Security check: Rate Limiting
      if (aiSecurity.checkRateLimit(userId)) {
        return res.status(429).json({ 
          type: "rich", 
          blocks: [{ type: "warning", content: "Siz so'rovlar limitidan oshib ketdingiz (minutiga maksimal 20 marta). Iltimos, birozdan so'ng qayta urinib ko'ring." }] 
        });
      }

      // 2. Security check: Prompt Injection
      if (aiSecurity.checkPromptInjection(query)) {
        return res.status(403).json({ 
          type: "rich", 
          blocks: [{ type: "warning", content: "Sizning so'rovingiz xavfsizlik qoidalariga zid. Iltimos, to'g'ri savol bering." }] 
        });
      }

      // 3. Memory pruning
      const prunedHistory = aiMemory.pruneHistory(history);

      // 4. Prompt Building
      const systemInstruction = promptBuilder.buildSystemInstruction(user, currentRole, path);

      // 5. Engine generation
      const rawText = await aiEngine.generateResponse(query, systemInstruction, prunedHistory);

      // 6. Response parsing
      try {
        const blocks = JSON.parse(rawText.trim());
        if (Array.isArray(blocks)) {
          return res.json({ type: "rich", blocks });
        } else if (blocks.blocks && Array.isArray(blocks.blocks)) {
          return res.json({ type: "rich", blocks: blocks.blocks });
        } else {
          return res.json({ type: "rich", blocks: [{ type: "text", content: rawText }] });
        }
      } catch (jsonErr) {
        console.error("Failed to parse Gemini response as JSON blocks, fallback to text block:", jsonErr);
        return res.json({
          type: "rich",
          blocks: [{ type: "text", content: rawText }]
        });
      }

    } catch (err) {
      console.error('AI Controller Error:', err);
      // Ensure we don't leak internal error messages in production
      return res.status(500).json({ 
        type: "rich", 
        blocks: [{ type: "warning", content: "Tizimda xatolik yuz berdi. Iltimos qayta urinib ko'ring." }] 
      });
    }
  }
}

module.exports = new AiController();
