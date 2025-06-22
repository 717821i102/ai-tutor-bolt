"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./App.css");
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("@chakra-ui/react");
// Pages
const Dashboard_1 = __importDefault(require("./pages/Dashboard"));
const Login_1 = __importDefault(require("./pages/Login"));
const Signup_1 = __importDefault(require("./pages/Signup"));
const Lesson_1 = __importDefault(require("./pages/Lesson"));
const LessonList_1 = __importDefault(require("./pages/LessonList"));
const QAInterface_1 = __importDefault(require("./pages/QAInterface"));
const Profile_1 = __importDefault(require("./pages/Profile"));
const Analytics_1 = __importDefault(require("./pages/Analytics"));
const Settings_1 = __importDefault(require("./pages/Settings"));
const Completed_1 = __importDefault(require("./pages/Completed"));
const NotFound_1 = __importDefault(require("./pages/NotFound"));
// Components
const MainLayout_1 = __importDefault(require("./components/layouts/MainLayout"));
const AuthLayout_1 = __importDefault(require("./components/layouts/AuthLayout"));
const ProtectedRoute_1 = __importDefault(require("./components/routing/ProtectedRoute"));
const ErrorBoundary_1 = __importDefault(require("./components/common/ErrorBoundary"));
function App() {
    return (<ErrorBoundary_1.default>
      <react_2.Box className="App">
        <react_router_dom_1.Routes>
          {/* Auth routes */}
          <react_router_dom_1.Route element={<AuthLayout_1.default />}>
            <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
            <react_router_dom_1.Route path="/signup" element={<Signup_1.default />}/>
          </react_router_dom_1.Route>

          {/* Protected routes */}
          <react_router_dom_1.Route element={<ProtectedRoute_1.default />}>
            <react_router_dom_1.Route element={<MainLayout_1.default />}>
              <react_router_dom_1.Route path="/" element={<Dashboard_1.default />}/>
              <react_router_dom_1.Route path="/lessons" element={<LessonList_1.default />}/>
              <react_router_dom_1.Route path="/lessons/:lessonId" element={<Lesson_1.default />}/>
              <react_router_dom_1.Route path="/qa" element={<QAInterface_1.default />}/>
              <react_router_dom_1.Route path="/profile" element={<Profile_1.default />}/>
              <react_router_dom_1.Route path="/analytics" element={<Analytics_1.default />}/>
              <react_router_dom_1.Route path="/settings" element={<Settings_1.default />}/>
              <react_router_dom_1.Route path="/completed" element={<Completed_1.default />}/>
            </react_router_dom_1.Route>
          </react_router_dom_1.Route>

          {/* Catch-all route */}
          <react_router_dom_1.Route path="*" element={<NotFound_1.default />}/>
        </react_router_dom_1.Routes>
      </react_2.Box>
    </ErrorBoundary_1.default>);
}
exports.default = App;
//# sourceMappingURL=App.js.map