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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const react_router_dom_1 = require("react-router-dom");
const react_hook_form_1 = require("react-hook-form");
const fi_1 = require("react-icons/fi");
const AuthContext_1 = require("../contexts/AuthContext");
const GoogleSignInButton_1 = __importDefault(require("../components/GoogleSignInButton"));
const Login = () => {
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { login } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const toast = (0, react_2.useToast)();
    // Color mode values
    const textColor = (0, react_2.useColorModeValue)('gray.800', 'gray.100');
    const mutedTextColor = (0, react_2.useColorModeValue)('gray.600', 'gray.400');
    const { register, handleSubmit, formState: { errors } } = (0, react_hook_form_1.useForm)();
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            navigate('/');
            toast({
                title: 'Welcome back!',
                description: 'You have successfully signed in.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Sign in failed',
                description: error.message || 'Please check your credentials and try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<react_2.VStack spacing={8} align="stretch">
      {/* Header */}
      <react_2.VStack spacing={2} textAlign="center">
        <react_2.Heading size="lg" color={textColor}>Welcome back</react_2.Heading>
        <react_2.Text color={mutedTextColor}>
          Sign in to continue your learning journey
        </react_2.Text>
      </react_2.VStack>

      {/* Google Sign In */}
      <GoogleSignInButton_1.default text="Continue with Google"/>

      {/* Divider */}
      <react_2.HStack>
        <react_2.Divider />
        <react_2.Text fontSize="sm" color={mutedTextColor} px={3}>
          or
        </react_2.Text>
        <react_2.Divider />
      </react_2.HStack>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <react_2.VStack spacing={6}>
          <react_2.FormControl id="email" isInvalid={!!errors.email}>
            <react_2.FormLabel color={textColor}>Email address</react_2.FormLabel>
            <react_2.InputGroup>
              <react_2.Input type="email" placeholder="Enter your email" size="lg" {...register('email', {
        required: 'Email is required',
        pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Please enter a valid email address',
        },
    })}/>
              <react_2.InputRightElement h="full" pointerEvents="none">
                <react_2.Icon as={fi_1.FiMail} color="gray.400"/>
              </react_2.InputRightElement>
            </react_2.InputGroup>
            <react_2.FormErrorMessage>{errors.email?.message}</react_2.FormErrorMessage>
          </react_2.FormControl>
          
          <react_2.FormControl id="password" isInvalid={!!errors.password}>
            <react_2.FormLabel color={textColor}>Password</react_2.FormLabel>
            <react_2.InputGroup>
              <react_2.Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" size="lg" {...register('password', {
        required: 'Password is required',
        minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
        },
    })}/>
              <react_2.InputRightElement h="full">
                <react_2.Button variant="ghost" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  <react_2.Icon as={showPassword ? fi_1.FiEyeOff : fi_1.FiEye} color="gray.400"/>
                </react_2.Button>
              </react_2.InputRightElement>
            </react_2.InputGroup>
            <react_2.FormErrorMessage>{errors.password?.message}</react_2.FormErrorMessage>
          </react_2.FormControl>

          {/* Remember me and forgot password */}
          <react_2.HStack justify="space-between" w="full">
            <react_2.Checkbox {...register('rememberMe')} colorScheme="brand">
              <react_2.Text fontSize="sm" color={textColor}>Remember me</react_2.Text>
            </react_2.Checkbox>
            <react_2.Link as={react_router_dom_1.Link} to="/forgot-password" fontSize="sm" color="brand.500" _hover={{ color: 'brand.600' }}>
              Forgot password?
            </react_2.Link>
          </react_2.HStack>
          
          <react_2.Button type="submit" colorScheme="brand" size="lg" w="full" isLoading={isLoading} loadingText="Signing in...">
            Sign In
          </react_2.Button>
        </react_2.VStack>
      </form>

      {/* Sign up link */}
      <react_2.Text textAlign="center" fontSize="sm" color={textColor}>
        Don't have an account?{' '}
        <react_2.Link as={react_router_dom_1.Link} to="/signup" color="brand.500" fontWeight="semibold" _hover={{ color: 'brand.600' }}>
          Create one now
        </react_2.Link>
      </react_2.Text>
    </react_2.VStack>);
};
exports.default = Login;
//# sourceMappingURL=Login.js.map