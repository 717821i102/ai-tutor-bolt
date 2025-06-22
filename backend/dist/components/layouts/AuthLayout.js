"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("@chakra-ui/react");
const fi_1 = require("react-icons/fi");
const AuthContext_1 = require("../../contexts/AuthContext");
const AuthLayout = () => {
    const { currentUser, isLoading } = (0, AuthContext_1.useAuth)();
    // Move all hooks to the top
    const bgGradient = (0, react_2.useColorModeValue)('linear(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', 'linear(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)');
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.800');
    const textColor = (0, react_2.useColorModeValue)('gray.600', 'gray.300');
    const featureIconBg = (0, react_2.useColorModeValue)('brand.100', 'brand.900');
    const featureTitleColor = (0, react_2.useColorModeValue)('gray.800', 'white');
    const featureDescColor = (0, react_2.useColorModeValue)('gray.600', 'gray.300');
    const socialProofBg = (0, react_2.useColorModeValue)('white', 'gray.800');
    const socialProofTextColor = (0, react_2.useColorModeValue)('gray.600', 'gray.300');
    const socialProofSubColor = (0, react_2.useColorModeValue)('gray.500', 'gray.400');
    const borderColor = (0, react_2.useColorModeValue)('gray.200', 'gray.700');
    // Redirect to dashboard if already authenticated
    if (!isLoading && currentUser) {
        return <react_router_dom_1.Navigate to="/" replace/>;
    }
    return (<react_2.Box minHeight="100vh" bgGradient={bgGradient}>
      <react_2.Container maxW="container.xl" py={8}>
        <react_2.Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="center" minH="calc(100vh - 4rem)" gap={12}>
          {/* Left side - Branding and features */}
          <react_2.VStack spacing={8} align={{ base: 'center', lg: 'start' }} flex={1} maxW={{ base: 'full', lg: '500px' }} textAlign={{ base: 'center', lg: 'left' }}>
            {/* Logo and brand */}
            <react_2.VStack spacing={4} align={{ base: 'center', lg: 'start' }}>
              <react_2.HStack spacing={3}>
                <react_2.Image src="/aitutor-nobackground.png" alt="AI Tutor Logo" w="80px" h="80px" borderRadius="xl" boxShadow="gradient-lg"/>
                <react_2.VStack align="start" spacing={0}>
                  <react_2.Heading size="xl" variant="gradient">
                    AI Tutor
                  </react_2.Heading>
                  <react_2.Text color={textColor} fontSize="lg" fontWeight="medium">
                    Powered by VizTalk AI
                  </react_2.Text>
                </react_2.VStack>
              </react_2.HStack>
              
              <react_2.Text fontSize="xl" color={textColor} maxW="md" lineHeight="tall">
                Experience the future of education with AI-powered lessons, 
                personalized learning paths, and instant Q&A assistance.
              </react_2.Text>
            </react_2.VStack>

            {/* Features */}
            <react_2.VStack spacing={6} align="stretch" w="full" maxW="md">
              <FeatureItem icon={fi_1.FiZap} title="AI-Powered Learning" description="Get personalized lessons generated specifically for your learning style and pace" iconBg={featureIconBg} titleColor={featureTitleColor} descColor={featureDescColor}/>
              <FeatureItem icon={fi_1.FiUsers} title="Interactive Q&A" description="Ask questions anytime and get instant, contextual answers from our AI tutor" iconBg={featureIconBg} titleColor={featureTitleColor} descColor={featureDescColor}/>
              <FeatureItem icon={fi_1.FiShield} title="Progress Tracking" description="Monitor your learning journey with detailed analytics and achievements" iconBg={featureIconBg} titleColor={featureTitleColor} descColor={featureDescColor}/>
            </react_2.VStack>

            {/* Social proof */}
            <react_2.Box p={6} bg={socialProofBg} borderRadius="2xl" boxShadow="gradient-md" w="full" maxW="md" border="1px solid" borderColor={borderColor}>
              <react_2.Text fontSize="sm" color={socialProofTextColor} mb={2}>
                Trusted by learners worldwide
              </react_2.Text>
              <react_2.HStack spacing={6}>
                <react_2.VStack spacing={0}>
                  <react_2.Text fontSize="2xl" fontWeight="bold" bgGradient="linear(135deg, #A855F7 0%, #3B82F6 100%)" bgClip="text">
                    10K+
                  </react_2.Text>
                  <react_2.Text fontSize="xs" color={socialProofSubColor}>
                    Active Learners
                  </react_2.Text>
                </react_2.VStack>
                <react_2.VStack spacing={0}>
                  <react_2.Text fontSize="2xl" fontWeight="bold" bgGradient="linear(135deg, #A855F7 0%, #3B82F6 100%)" bgClip="text">
                    50K+
                  </react_2.Text>
                  <react_2.Text fontSize="xs" color={socialProofSubColor}>
                    Lessons Completed
                  </react_2.Text>
                </react_2.VStack>
                <react_2.VStack spacing={0}>
                  <react_2.Text fontSize="2xl" fontWeight="bold" bgGradient="linear(135deg, #A855F7 0%, #3B82F6 100%)" bgClip="text">
                    95%
                  </react_2.Text>
                  <react_2.Text fontSize="xs" color={socialProofSubColor}>
                    Satisfaction Rate
                  </react_2.Text>
                </react_2.VStack>
              </react_2.HStack>
            </react_2.Box>
          </react_2.VStack>

          {/* Right side - Auth form */}
          <react_2.Box bg={cardBg} p={8} borderRadius="3xl" boxShadow="gradient-lg" w="full" maxW="450px" border="1px solid" borderColor={borderColor}>
            <react_router_dom_1.Outlet />
          </react_2.Box>
        </react_2.Flex>
      </react_2.Container>
    </react_2.Box>);
};
const FeatureItem = ({ icon, title, description, iconBg, titleColor, descColor }) => {
    return (<react_2.HStack spacing={4} align="start">
      <react_2.Box p={3} bgGradient="linear(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)" borderRadius="xl" color="brand.500" flexShrink={0} border="1px solid" borderColor="brand.200">
        <react_2.Icon as={icon} boxSize={6}/>
      </react_2.Box>
      <react_2.VStack align="start" spacing={1}>
        <react_2.Text fontWeight="bold" color={titleColor}>
          {title}
        </react_2.Text>
        <react_2.Text fontSize="sm" color={descColor}>
          {description}
        </react_2.Text>
      </react_2.VStack>
    </react_2.HStack>);
};
exports.default = AuthLayout;
//# sourceMappingURL=AuthLayout.js.map