"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tutor_routes_1 = __importDefault(require("./tutor.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const tutor_controller_1 = require("../controllers/tutor.controller");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const lessons_1 = __importDefault(require("./lessons"));
const qa_1 = __importDefault(require("./qa"));
const users_1 = __importDefault(require("./users"));
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
// API v1 routes
const v1Router = (0, express_1.Router)();
router.use('/v1', v1Router);
// Mount v1 routes
v1Router.use('/lessons', lessons_1.default);
v1Router.use('/qa', qa_1.default);
v1Router.use('/users', users_1.default);
// Legacy API routes with controllers
router.use('/tutor', tutor_routes_1.default);
router.use('/users', user_routes_1.default);
// Direct controller routes
router.post('/ask', auth_middleware_1.authenticate, tutor_controller_1.askQuestion);
router.get('/profile', auth_middleware_1.authenticate, user_controller_1.getUserProfile);
exports.default = router;
//# sourceMappingURL=index.js.map