"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQAResponse = exports.generateLesson = exports.geminiModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
exports.geminiModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
    },
});
const generateLesson = async (subject, topic, difficulty, durationMinutes, learningObjectives) => {
    const objectives = learningObjectives?.join(', ') || 'general understanding';
    const prompt = `Create a comprehensive ${difficulty} level lesson about "${topic}" in ${subject}.

Requirements:
- Duration: ${durationMinutes} minutes
- Learning objectives: ${objectives}
- Target audience: ${difficulty} learners
- Include practical examples and clear explanations

Please structure the response as a JSON object with this exact format:
{
  "title": "Lesson title",
  "summary": "Brief lesson summary (2-3 sentences)",
  "content": [
    {
      "title": "Section title",
      "content": "Detailed content for this section",
      "order": 1,
      "type": "text"
    }
  ],
  "exercises": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this answer is correct"
    }
  ],
  "tags": ["relevant", "tags"]
}

Make sure the content is educational, engaging, and appropriate for the ${difficulty} level.`;
    try {
        const result = await exports.geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }
        return JSON.parse(jsonMatch[0]);
    }
    catch (error) {
        console.error('Error generating lesson:', error);
        throw new Error('Failed to generate lesson content');
    }
};
exports.generateLesson = generateLesson;
const generateQAResponse = async (question, context, chatHistory) => {
    let prompt = `You are an AI tutor. Answer this question clearly and helpfully: "${question}"`;
    if (context) {
        prompt += `\n\nContext: ${context}`;
    }
    if (chatHistory && chatHistory.length > 0) {
        prompt += '\n\nPrevious conversation:';
        chatHistory.slice(-3).forEach(msg => {
            prompt += `\nQ: ${msg.question}\nA: ${msg.answer}`;
        });
    }
    prompt += '\n\nProvide a helpful, educational response. If you reference any sources or concepts, mention them clearly.';
    try {
        const result = await exports.geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error('Error generating QA response:', error);
        throw new Error('Failed to generate response');
    }
};
exports.generateQAResponse = generateQAResponse;
//# sourceMappingURL=gemini.js.map