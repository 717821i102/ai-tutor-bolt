import React from 'react';
import { QASession } from '../../types/qa';
interface SessionListProps {
    sessions: QASession[];
    activeSessionId?: string;
    onSessionSelect: (session: QASession) => void;
    onSessionEdit: (session: QASession) => void;
    onSessionDelete: (sessionId: string) => void;
    isLoading?: boolean;
}
declare const SessionList: React.FC<SessionListProps>;
export default SessionList;
//# sourceMappingURL=SessionList.d.ts.map