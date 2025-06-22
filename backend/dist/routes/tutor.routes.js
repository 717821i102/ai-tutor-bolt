"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const tutor_controller_1 = require("../controllers/tutor.controller");
const router = (0, express_1.Router)();
// Use the controller instead of inline handler
router.post('/ask', auth_middleware_1.authenticate, tutor_controller_1.askQuestion);
exports.default = router;
//# sourceMappingURL=tutor.routes.js.map