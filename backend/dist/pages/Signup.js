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
const Signup = () => {
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { signup } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const toast = (0, react_2.useToast)();
    // Color mode values
    const textColor = (0, react_2.useColorModeValue)('gray.800', 'gray.100');
    const mutedTextColor = (0, react_2.useColorModeValue)('gray.600', 'gray.400');
    const { register, handleSubmit, watch, formState: { errors } } = (0, react_hook_form_1.useForm)();
    const watchPassword = watch('password');
    // Password strength calculation
    const getPasswordStrength = (password) => {
        if (!password)
            return 0;
        let strength = 0;
        if (password.length >= 8)
            strength += 25;
        if (/[a-z]/.test(password))
            strength += 25;
        if (/[A-Z]/.test(password))
            strength += 25;
        if (/[0-9]/.test(password))
            strength += 25;
        return strength;
    };
    const passwordStrength = getPasswordStrength(watchPassword || '');
    const getPasswordStrengthColor = (strength) => {
        if (strength < 50)
            return 'red';
        if (strength < 75)
            return 'yellow';
        return 'green';
    };
    const getPasswordStrengthText = (strength) => {
        if (strength < 25)
            return 'Very weak';
        if (strength < 50)
            return 'Weak';
        if (strength < 75)
            return 'Good';
        return 'Strong';
    };
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await signup(data.email, data.password, data.name);
            navigate('/');
            toast({
                title: 'Welcome to AI Tutor Pro!',
                description: 'Your account has been successfully created. Let\'s start learning!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Signup error:', error);
            toast({
                title: 'Account creation failed',
                description: error.message || 'An error occurred while creating your account. Please try again.',
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
        <react_2.Heading size="lg" color={textColor}>Create your account</react_2.Heading>
        <react_2.Text color={mutedTextColor}>
          Join thousands of learners on AI Tutor Pro
        </react_2.Text>
      </react_2.VStack>

      {/* Google Sign Up */}
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
          <react_2.FormControl id="name" isInvalid={!!errors.name}>
            <react_2.FormLabel color={textColor}>Full Name</react_2.FormLabel>
            <react_2.InputGroup>
              <react_2.Input type="text" placeholder="Enter your full name" size="lg" {...register('name', {
        required: 'Full name is required',
        minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
        },
        pattern: {
            value: /^[a-zA-Z\s]+$/,
            message: 'Name can only contain letters and spaces',
        },
    })}/>
              <react_2.InputRightElement h="full" pointerEvents="none">
                <react_2.Icon as={fi_1.FiUser} color="gray.400"/>
              </react_2.InputRightElement>
            </react_2.InputGroup>
            <react_2.FormErrorMessage>{errors.name?.message}</react_2.FormErrorMessage>
          </react_2.FormControl>
          
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
              <react_2.Input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" size="lg" {...register('password', {
        required: 'Password is required',
        minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
        },
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        },
    })}/>
              <react_2.InputRightElement h="full">
                <react_2.Button variant="ghost" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  <react_2.Icon as={showPassword ? fi_1.FiEyeOff : fi_1.FiEye} color="gray.400"/>
                </react_2.Button>
              </react_2.InputRightElement>
            </react_2.InputGroup>
            
            {/* Password strength indicator */}
            {watchPassword && (<react_2.VStack mt={2} align="stretch">
                <react_2.HStack justify="space-between" mb={1}>
                  <react_2.Text fontSize="xs" color={mutedTextColor}>Password strength</react_2.Text>
                  <react_2.Text fontSize="xs" color={`${getPasswordStrengthColor(passwordStrength)}.500`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </react_2.Text>
                </react_2.HStack>
                <react_2.Progress value={passwordStrength} colorScheme={getPasswordStrengthColor(passwordStrength)} size="sm" borderRadius="full"/>
              </react_2.VStack>)}
            
            <react_2.FormErrorMessage>{errors.password?.message}</react_2.FormErrorMessage>
          </react_2.FormControl>
          
          <react_2.FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
            <react_2.FormLabel color={textColor}>Confirm Password</react_2.FormLabel>
            <react_2.InputGroup>
              <react_2.Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" size="lg" {...register('confirmPassword', {
        required: 'Please confirm your password',
        validate: value => value === watchPassword || 'Passwords do not match'
    })}/>
              <react_2.InputRightElement h="full">
                <react_2.Button variant="ghost" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                  <react_2.Icon as={showConfirmPassword ? fi_1.FiEyeOff : fi_1.FiEye} color="gray.400"/>
                </react_2.Button>
              </react_2.InputRightElement>
            </react_2.InputGroup>
            <react_2.FormErrorMessage>{errors.confirmPassword?.message}</react_2.FormErrorMessage>
          </react_2.FormControl>

          {/* Terms and conditions */}
          <react_2.FormControl isInvalid={!!errors.agreeToTerms}>
            <react_2.Checkbox {...register('agreeToTerms', {
        required: 'You must agree to the terms and conditions'
    })} colorScheme="brand">
              <react_2.Text fontSize="sm" color={textColor}>
                I agree to the{' '}
                <react_2.Link color="brand.500" _hover={{ color: 'brand.600' }}>
                  Terms of Service
                </react_2.Link>{' '}
                and{' '}
                <react_2.Link color="brand.500" _hover={{ color: 'brand.600' }}>
                  Privacy Policy
                </react_2.Link>
              </react_2.Text>
            </react_2.Checkbox>
            <react_2.FormErrorMessage>{errors.agreeToTerms?.message}</react_2.FormErrorMessage>
          </react_2.FormControl>
          
          <react_2.Button type="submit" colorScheme="brand" size="lg" w="full" isLoading={isLoading} loadingText="Creating account...">
            Create Account
          </react_2.Button>
        </react_2.VStack>
      </form>

      {/* Sign in link */}
      <react_2.Text textAlign="center" fontSize="sm" color={textColor}>
        Already have an account?{' '}
        <react_2.Link as={react_router_dom_1.Link} to="/login" color="brand.500" fontWeight="semibold" _hover={{ color: 'brand.600' }}>
          Sign in here
        </react_2.Link>
      </react_2.Text>
    </react_2.VStack>);
};
exports.default = Signup;
//# sourceMappingURL=Signup.js.map