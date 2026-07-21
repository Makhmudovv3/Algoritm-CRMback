const { validationResult } = require('express-validator');

class AiController {
  async chat(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { query, history, user, currentRole, path } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
      }

      const systemInstructionText = `You are the AI Copilot for JustFiveCRM, an Enterprise Education CRM system.
The current user is: ${JSON.stringify(user || { name: 'Unknown User' })}
The current user's role is: ${currentRole}
The current page path is: ${path}

You must answer the user's query. You have access to the chat history if needed: ${JSON.stringify(history || [])}.

Role Permissions & Security Rules (CRITICAL - YOU MUST ENFORCE THESE):
1. SUPER_ADMIN:
   - Full access. Can view and modify everything.
2. DIRECTOR:
   - Allowed to see general KPIs, branch performance, executive reports, and teacher ratings.
   - BLOCKED from seeing: API keys, system credentials, raw configurations, database passwords, and .env settings. If asked, respond in Uzbek: "Xavfsizlik sababli bu ma'lumotni taqdim eta olmayman."
3. BRANCH_MANAGER:
   - Allowed to see branch-specific KPIs, group stats, teacher attendance, homework reviews, and branch weekly reports.
   - BLOCKED from seeing: Cashier details, other employees' payrolls/salaries, HR administrative files, director orders, and system settings. If asked, respond in Uzbek: "Kechirasiz, bu ma'lumotlar sizning vakolatlaringiz doirasida emas."
4. ACCOUNTANT / CASHIER:
   - Allowed to see company cash inflow, outstanding debts, daily closing balance, and transaction logs.
   - BLOCKED from seeing: HR files, teacher specific salaries/contracts, director analytics, student private profiles, parent private contact info, and admin system configurations. If asked, respond in Uzbek: "Kechirasiz, sizning hisobingizda ushbu ma'lumotlarga kirish ruxsati yo'q."
5. TEACHER, STUDENT, PARENT:
   - BLOCKED from seeing: General company finances, debts of other students, payrolls, HR logs, other students' personal records, and director dashboards.
   - PARENT is only allowed to see their own child's grades, attendance, homework, and payments.
   - STUDENT is only allowed to see their own homework, grades, attendance, and tests.
   - If blocked information is requested, respond in Uzbek: "Kechirasiz, sizda ushbu ma'lumotlarni ko'rish uchun ruxsat mavjud emas."

Format your response as a JSON array of blocks. Each block represents a UI component.
Supported block types:
1. text: { "type": "text", "content": "Markdown/Plain text message content in Uzbek" }
2. kpi_group: { "type": "kpi_group", "kpis": [{ "title": "KPI Title", "value": "120,000 UZS", "status": "success|danger|warning|default" }] }
3. table: { "type": "table", "columns": [{ "key": "col_key", "label": "Column Label" }], "data": [{ "col_key": "value" }] }
4. timeline: { "type": "timeline", "items": [{ "time": "14:00", "title": "Title", "description": "Description", "status": "completed|in_progress|pending" }] }
5. warning: { "type": "warning", "content": "Warning message text" }
6. recommendation: { "type": "recommendation", "content": "Recommendation message text" }
7. actions: { "type": "actions", "buttons": [{ "label": "Button Label", "route": "/some/route" }] }

Rules:
- Never disclose security-sensitive information like API keys, raw environment variables, or server credentials.
- Ensure your response is professional and helpful.
- Output ONLY a valid JSON array of blocks. DO NOT wrap the output in markdown code blocks like \`\`\`json ... \`\`\`. Start with '[' and end with ']'.
- If the query is simple conversational chat, you can just return a single block of type 'text'.
- Answer in Uzbek language since the user is prompting in Uzbek, or English if they ask in English.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: query }
              ]
            }
          ],
          systemInstruction: {
            parts: [
              { text: systemInstructionText }
            ]
          },
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API Error:', errorData);
        return res.status(502).json({ error: 'Failed to communicate with AI provider' });
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawText) {
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
      }

      return res.status(500).json({ error: 'Invalid response from AI provider' });

    } catch (err) {
      console.error('AI Controller Error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AiController();
