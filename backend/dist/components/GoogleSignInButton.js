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
const fc_1 = require("react-icons/fc");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
const GoogleSignInButton = ({ text = 'Sign in with Google' }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { signInWithGoogle } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const toast = (0, react_2.useToast)();
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            navigate('/');
            toast({
                title: 'Success',
                description: 'Successfully signed in with Google',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Google sign-in error:', error);
            let errorMessage = 'Failed to sign in with Google';
            if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Pop-up blocked by your browser. Please allow pop-ups for this site and try again.';
            }
            else if (error.message) {
                errorMessage = error.message;
            }
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<react_2.Button w="full" variant="outline" leftIcon={<react_2.Icon as={fc_1.FcGoogle} boxSize="20px"/>} onClick={handleGoogleSignIn} isLoading={isLoading} loadingText="Signing in" size="lg" _hover={{ bg: 'gray.50' }}>
      {text}
    </react_2.Button>);
};
exports.default = GoogleSignInButton;
//# sourceMappingURL=GoogleSignInButton.js.map