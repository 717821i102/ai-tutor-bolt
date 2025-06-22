import React from 'react';
import { QASession, UpdateSessionRequest } from '../../types/qa';
interface SessionHeaderProps {
    session: QASession;
    onSessionUpdate: (sessionId: string, updates: UpdateSessionRequest) => Promise<void>;
}
declare const SessionHeader: React.FC<SessionHeaderProps>;
export default SessionHeader;
//# sourceMappingURL=SessionHeader.d.ts.map