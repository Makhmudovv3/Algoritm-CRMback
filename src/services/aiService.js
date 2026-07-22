const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

// User requested placeholders if token is missing
const API_KEY = process.env.OPENAI_API_KEY || 'PLACEHOLDER_KEY';

const openai = new OpenAI({
  apiKey: API_KEY,
});

class AiService {
  async getDashboardSummary(stats) {
    if (API_KEY === 'PLACEHOLDER_KEY') {
      return "Tizim ma'lumotlari asosida analiz: O'quvchilar va daromad ko'rsatkichlari barqaror. (BETA: OpenAI API kaliti kiritilmagan)";
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert CRM Data Analyst for an educational center.' },
          { role: 'user', content: `Analyze the following CRM data and give a 2-sentence summary in Uzbek: ${JSON.stringify(stats)}` }
        ],
        max_tokens: 150
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Error:', error);
      return "AI tahlilida xatolik yuz berdi.";
    }
  }

  async predictRevenue(financeData) {
    if (API_KEY === 'PLACEHOLDER_KEY') {
      return { predictedRevenue: 0, growthTrend: 'stable', advice: 'Tizim ishlashi uchun OpenAI kalitini ulang.' };
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a Financial Analyst AI. Return only JSON format.' },
          { role: 'user', content: `Analyze the past finance data and predict next month revenue, trend, and advice. Data: ${JSON.stringify(financeData)}` }
        ],
        response_format: { type: "json_object" }
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      return { predictedRevenue: 0, growthTrend: 'unknown', advice: 'Error analyzing data.' };
    }
  }

  async analyzeStudentDropRisk(studentData, attendanceData) {
    if (API_KEY === 'PLACEHOLDER_KEY') {
      return studentData.map(s => ({ ...s, dropRisk: 'low', reason: 'N/A' }));
    }
    
    // Analyze drop risk based on attendance and payments
    // Implementation placeholder for large scale CRM logic
    return [];
  }
}

module.exports = new AiService();
