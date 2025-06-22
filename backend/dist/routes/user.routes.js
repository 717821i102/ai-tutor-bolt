"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Use the controller instead of inline handler
router.get('/profile', auth_middleware_1.authenticate, user_controller_1.getUserProfile);
exports.default = router;
//# sourceMappingURL=user.routes.js.map