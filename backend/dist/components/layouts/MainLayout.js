"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("@chakra-ui/react");
const Navbar_1 = __importDefault(require("../navigation/Navbar"));
const Sidebar_1 = __importDefault(require("../navigation/Sidebar"));
const MainLayout = () => {
    return (<react_2.Box minHeight="100vh">
      <Navbar_1.default />
      <react_2.Flex>
        <Sidebar_1.default />
        <react_2.Box flex="1" p={4} ml={{ base: 0, md: '240px' }} // Default width, will be overridden by sidebar state
     transition="margin-left 0.3s ease" style={{
            marginLeft: 'var(--sidebar-width, 240px)'
        }}>
          <react_router_dom_1.Outlet />
        </react_2.Box>
      </react_2.Flex>
    </react_2.Box>);
};
exports.default = MainLayout;
//# sourceMappingURL=MainLayout.js.map