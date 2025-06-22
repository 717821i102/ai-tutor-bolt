"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const react_router_dom_1 = require("react-router-dom");
const NotFound = () => {
    return (<react_2.Center minHeight="100vh" bg={(0, react_2.useColorModeValue)('gray.50', 'gray.800')}>
      <react_2.VStack spacing={8} textAlign="center" p={8}>
        <react_2.Heading size="4xl" color="brand.500">404</react_2.Heading>
        <react_2.Heading size="xl">Page Not Found</react_2.Heading>
        <react_2.Text fontSize="lg">
          The page you're looking for doesn't exist or has been moved.
        </react_2.Text>
        <react_2.Button as={react_router_dom_1.Link} to="/" colorScheme="brand" size="lg">
          Return to Homepage
        </react_2.Button>
      </react_2.VStack>
    </react_2.Center>);
};
exports.default = NotFound;
//# sourceMappingURL=NotFound.js.map