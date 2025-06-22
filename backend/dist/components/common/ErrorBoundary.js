"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
class ErrorBoundary extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
        };
        this.handleReload = () => {
            window.location.reload();
        };
        this.handleReset = () => {
            this.setState({ hasError: false, error: undefined });
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (<react_2.Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={8}>
          <react_2.VStack spacing={6} maxW="md" textAlign="center">
            <react_2.Alert status="error" borderRadius="lg">
              <react_2.AlertIcon />
              <react_2.Box>
                <react_2.AlertTitle>Something went wrong!</react_2.AlertTitle>
                <react_2.AlertDescription>
                  An unexpected error occurred. Please try refreshing the page.
                </react_2.AlertDescription>
              </react_2.Box>
            </react_2.Alert>

            <react_2.VStack spacing={4}>
              <react_2.Heading size="lg">Oops! Something went wrong</react_2.Heading>
              <react_2.Text color="gray.600">
                We're sorry for the inconvenience. The error has been logged and we'll look into it.
              </react_2.Text>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (<react_2.Box as="pre" p={4} bg="gray.100" borderRadius="md" fontSize="sm" textAlign="left" overflow="auto" maxW="full">
                  {this.state.error.message}
                </react_2.Box>)}
            </react_2.VStack>

            <react_2.VStack spacing={3}>
              <react_2.Button colorScheme="brand" onClick={this.handleReload}>
                Refresh Page
              </react_2.Button>
              <react_2.Button variant="outline" onClick={this.handleReset}>
                Try Again
              </react_2.Button>
            </react_2.VStack>
          </react_2.VStack>
        </react_2.Box>);
        }
        return this.props.children;
    }
}
exports.default = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map