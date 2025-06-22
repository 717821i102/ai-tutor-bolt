export declare const geminiModel: import("@google/generative-ai").GenerativeModel;
export declare const generateLesson: (subject: string, topic: string, difficulty: string, durationMinutes: number, learningObjectives?: string[]) => Promise<any>;
export declare const generateQAResponse: (question: string, context?: string, chatHistory?: Array<{
    question: string;
    answer: string;
}>) => Promise<string>;
//# sourceMappingURL=gemini.d.ts.map