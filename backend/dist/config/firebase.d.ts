import admin from 'firebase-admin';
export declare const db: admin.firestore.Firestore;
export declare const auth: import("firebase-admin/lib/auth/auth").Auth;
export declare const collections: {
    readonly users: "users";
    readonly lessons: "lessons";
    readonly progress: "progress";
    readonly qaSessions: "qa_sessions";
    readonly settings: "settings";
};
//# sourceMappingURL=firebase.d.ts.map