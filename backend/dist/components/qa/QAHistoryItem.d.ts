import React from 'react';
interface Reference {
    title: string;
    source: string;
    url?: string;
}
interface QAHistoryItemProps {
    item: {
        id: string;
        question: string;
        answer: string;
        created_at: string;
        lesson_id?: string;
        references: Reference[];
    };
    onClick: () => void;
}
declare const QAHistoryItem: React.FC<QAHistoryItemProps>;
export default QAHistoryItem;
//# sourceMappingURL=QAHistoryItem.d.ts.map