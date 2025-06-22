export declare const config: {
    nodeEnv: string;
    port: number;
    apiV1Str: string;
    projectName: string;
    debug: boolean;
    cors: {
        origins: string[];
    };
    firebase: {
        projectId: string | undefined;
        privateKeyId: string | undefined;
        privateKey: string | undefined;
        clientEmail: string | undefined;
        clientId: string | undefined;
        authUri: string | undefined;
        tokenUri: string | undefined;
        authProviderX509CertUrl: string | undefined;
        clientX509CertUrl: string | undefined;
        universeDomain: string;
        databaseUrl: string | undefined;
        storageBucket: string | undefined;
    };
    gemini: {
        apiKey: string | undefined;
        model: string;
        maxTokens: number;
        temperature: number;
    };
    tts: {
        languageCode: string;
        voiceName: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    logging: {
        level: string;
    };
    isProduction: boolean;
    isDevelopment: boolean;
    isTest: boolean;
};
//# sourceMappingURL=config.d.ts.map