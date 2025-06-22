import React from 'react';
interface Reference {
    title: string;
    source: string;
    url?: string;
}
interface AnswerDisplayProps {
    question: string;
    answer: string;
    references?: Reference[];
    timestamp: string;
}
declare const AnswerDisplay: React.FC<AnswerDisplayProps>;
export default AnswerDisplay;
//# sourceMappingURL=AnswerDisplay.d.ts.map