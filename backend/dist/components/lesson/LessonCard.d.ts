import React from 'react';
interface LessonCardProps {
    lesson: {
        id: string;
        title: string;
        subject: string;
        topic: string;
        difficulty: string;
        duration_minutes: number;
        created_at: string;
        tags: string[];
        summary?: string;
    };
    progress?: {
        progress: number;
        completed: boolean;
    };
    onClick: () => void;
}
declare const LessonCard: React.FC<LessonCardProps>;
export default LessonCard;
//# sourceMappingURL=LessonCard.d.ts.map