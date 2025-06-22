"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = __importDefault(require("./config/env"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const firebase_1 = __importDefault(require("./config/firebase"));
// Initialize Firebase
(0, firebase_1.default)();
console.log('Firebase initialized successfully');
// Create Express app
const app = (0, express_1.default)();
const port = env_1.default.port;
// Apply middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: env_1.default.corsOrigin,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
// Logging
if (env_1.default.isDevelopment) {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);
// API routes
app.use('/api', routes_1.default);
// Error handling
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
// Start server
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    console.log(`Environment: ${env_1.default.env}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map