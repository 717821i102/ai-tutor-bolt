import React from 'react';
interface ExerciseProps {
    exercise: {
        question: string;
        options?: string[];
        correct_answer?: string;
        explanation?: string;
        difficulty: string;
    };
    index: number;
    selectedAnswer?: string;
    onAnswerSelect: (answer: string) => void;
}
declare const ExerciseComponent: React.FC<ExerciseProps>;
export default ExerciseComponent;
//# sourceMappingURL=ExerciseComponent.d.ts.map