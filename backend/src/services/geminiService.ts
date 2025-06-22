import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config';
import { LessonGenerateRequest, Lesson, QARequest } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.gemini.model });
  }

  async generateLesson(request: LessonGenerateRequest): Promise<Partial<Lesson>> {
    const prompt = `
Create a comprehensive educational lesson with the following specifications:
- Subject: ${request.subject}
- Topic: ${request.topic}
- Difficulty: ${request.difficulty}
- Duration: ${request.durationMinutes} minutes
${request.additionalInstructions ? `- Additional Instructions: ${request.additionalInstructions}` : ''}

Please structure the response as a JSON object with the following format:
{
  "title": "Lesson title",
  "summary": "Brief lesson summary",
  "content": [
    {
      "title": "Section title",
      "content": "Section content in markdown format",
      "type": "text",
      "order": 1
    }
  ],
  "exercises": [
    {
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Correct option",
      "explanation": "Explanation of the answer",
      "difficulty": "easy|medium|hard"
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "url": "https://example.com",
      "type": "article|video|book|website",
      "description": "Resource description"
    }
  ],
  "tags": ["tag1", "tag2", "tag3"]
}

Make sure the content is educational, engaging, and appropriate for the specified difficulty level.
Include 3-5 exercises and 2-3 additional resources.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const lessonData = JSON.parse(jsonMatch[0]);
      
      return {
        title: lessonData.title,
        subject: request.subject,
        topic: request.topic,
        difficulty: request.difficulty,
        durationMinutes: request.durationMinutes,
        summary: lessonData.summary,
        content: lessonData.content,
        exercises: lessonData.exercises,
        resources: lessonData.resources,
        tags: lessonData.tags,
      };
    } catch (error) {
      console.error('Error generating lesson:', error);
      throw new Error('Failed to generate lesson content');
    }
  }

  async answerQuestion(request: QARequest): Promise<{ answer: string; references: any[] }> {
    const contextPrompt = request.context 
      ? `Context: ${request.context}\n\n` 
      : '';
    
    const prompt = `
${contextPrompt}Question: ${request.question}

Please provide a comprehensive, educational answer to this question. 
If this is related to a specific lesson or educational topic, provide detailed explanations with examples.
Keep the answer informative but accessible for learners.

Format your response as a JSON object:
{
  "answer": "Your detailed answer in markdown format",
  "references": [
    {
      "title": "Reference title",
      "source": "Source name",
      "url": "https://example.com (if available)"
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const responseData = JSON.parse(jsonMatch[0]);
      
      return {
        answer: responseData.answer,
        references: responseData.references || [],
      };
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to generate answer');
    }
  }

  async generateLessonRecommendations(userPreferences: any, completedLessons: string[]): Promise<string[]> {
    const prompt = `
Based on the following user preferences and completed lessons, suggest 5 relevant topics for new lessons:

User Preferences:
- Difficulty: ${userPreferences.difficulty || 'adaptive'}
- Subjects: ${userPreferences.subjects?.join(', ') || 'General'}
- Learning Style: ${userPreferences.learningStyle || 'visual'}

Completed Lessons: ${completedLessons.length} lessons completed

Please suggest 5 new lesson topics that would be appropriate for this learner's progression.
Return as a JSON array of strings: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();