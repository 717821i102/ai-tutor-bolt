"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../../contexts/AuthContext");
const LoadingSpinner_1 = __importDefault(require("../common/LoadingSpinner"));
const ProtectedRoute = () => {
    const { currentUser, isLoading } = (0, AuthContext_1.useAuth)();
    // Show loading spinner while checking auth status
    if (isLoading) {
        return <LoadingSpinner_1.default fullScreen text="Checking authentication..."/>;
    }
    // Redirect to login if not authenticated
    if (!currentUser) {
        return <react_router_dom_1.Navigate to="/login" replace/>;
    }
    // Render child routes if authenticated
    return <react_router_dom_1.Outlet />;
};
exports.default = ProtectedRoute;
//# sourceMappingURL=ProtectedRoute.js.map