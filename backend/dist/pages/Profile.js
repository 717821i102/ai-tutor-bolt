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
const fi_1 = require("react-icons/fi");
const react_hook_form_1 = require("react-hook-form");
const AuthContext_1 = require("../contexts/AuthContext");
const api_1 = __importDefault(require("../services/api"));
const Profile = () => {
    const { currentUser, updateUserProfile } = (0, AuthContext_1.useAuth)();
    const toast = (0, react_2.useToast)();
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const statBg = (0, react_2.useColorModeValue)('gray.50', 'gray.800');
    // State
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [progressData, setProgressData] = (0, react_1.useState)(null);
    const [isLoadingProgress, setIsLoadingProgress] = (0, react_1.useState)(true);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    // Form handling
    const { handleSubmit, register, formState: { errors }, reset, setValue, } = (0, react_hook_form_1.useForm)();
    // Initialize form with current user data
    (0, react_1.useEffect)(() => {
        if (currentUser) {
            setValue('display_name', currentUser.displayName || '');
            setValue('avatar_url', currentUser.photoURL || '');
        }
    }, [currentUser, setValue]);
    // Fetch learning progress
    (0, react_1.useEffect)(() => {
        const fetchProgress = async () => {
            setIsLoadingProgress(true);
            setHasError(false);
            try {
                const response = await api_1.default.get('/users/me/progress');
                setProgressData(response.data);
            }
            catch (err) {
                console.error('Failed to fetch learning progress:', err);
                setHasError(true);
            }
            finally {
                setIsLoadingProgress(false);
            }
        };
        fetchProgress();
    }, []);
    // Update profile
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Update in Firebase Auth
            await updateUserProfile({
                displayName: data.display_name,
                photoURL: data.avatar_url,
            });
            // Update in backend
            await api_1.default.put('/users/me', {
                display_name: data.display_name,
                avatar_url: data.avatar_url,
            });
            toast({
                title: 'Profile updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setIsEditing(false);
        }
        catch (err) {
            console.error('Error updating profile:', err);
            toast({
                title: 'Update failed',
                description: err.message || 'Failed to update profile',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    // Cancel editing
    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };
    // Format minutes into hours and minutes
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };
    // Format date
    const formatDate = (dateString) => {
        if (!dateString)
            return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        catch {
            return 'N/A';
        }
    };
    // Calculate weekly progress
    const weeklyProgress = progressData?.statistics?.completed_this_week || 0;
    const weeklyGoal = progressData?.statistics?.weekly_goal || 7;
    const progressPercentage = weeklyGoal > 0 ? (weeklyProgress / weeklyGoal) * 100 : 0;
    return (<react_2.Container maxW="container.xl" py={8}>
      {/* Header */}
      <react_2.VStack spacing={2} align="start" mb={8}>
        <react_2.Heading as="h1" size="2xl" color="brand.600">
          Your Profile
        </react_2.Heading>
        <react_2.Text color="gray.600" fontSize="lg">
          Manage your account and track your learning progress
        </react_2.Text>
      </react_2.VStack>
      
      <react_2.Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8}>
        {/* Profile Info */}
        <react_2.GridItem>
          <react_2.Card bg={cardBg} boxShadow="lg" borderRadius="xl">
            <react_2.CardHeader>
              <react_2.Heading size="lg" color="brand.600">Profile Information</react_2.Heading>
            </react_2.CardHeader>
            <react_2.CardBody>
              <react_2.VStack spacing={6}>
                {/* Avatar and basic info */}
                <react_2.VStack spacing={4}>
                  <react_2.Avatar size="2xl" name={currentUser?.displayName || 'User'} src={currentUser?.photoURL || undefined} border="4px solid" borderColor="brand.100"/>
                  
                  {!isEditing ? (<react_2.VStack spacing={2} textAlign="center">
                      <react_2.Heading as="h2" size="lg" color="gray.800">
                        {currentUser?.displayName || 'User'}
                      </react_2.Heading>
                      <react_2.Text color="gray.500" fontSize="md">
                        {currentUser?.email}
                      </react_2.Text>
                      <react_2.Button leftIcon={<fi_1.FiEdit />} onClick={() => setIsEditing(true)} colorScheme="brand" variant="outline" mt={4}>
                        Edit Profile
                      </react_2.Button>
                    </react_2.VStack>) : (<react_2.Box w="full">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <react_2.VStack spacing={4} align="stretch">
                          <react_2.FormControl isInvalid={!!errors.display_name}>
                            <react_2.FormLabel>Display Name</react_2.FormLabel>
                            <react_2.Input {...register('display_name', {
            required: 'Display name is required',
            minLength: { value: 2, message: 'Minimum length should be 2 characters' }
        })} size="lg"/>
                            <react_2.FormErrorMessage>{errors.display_name?.message}</react_2.FormErrorMessage>
                          </react_2.FormControl>
                          
                          <react_2.FormControl>
                            <react_2.FormLabel>Avatar URL (optional)</react_2.FormLabel>
                            <react_2.Input {...register('avatar_url')} size="lg"/>
                          </react_2.FormControl>
                          
                          <react_2.HStack spacing={3} justify="flex-end" mt={4}>
                            <react_2.Button onClick={handleCancel} variant="outline">
                              Cancel
                            </react_2.Button>
                            <react_2.Button type="submit" colorScheme="brand" isLoading={isLoading} loadingText="Saving...">
                              Save Changes
                            </react_2.Button>
                          </react_2.HStack>
                        </react_2.VStack>
                      </form>
                    </react_2.Box>)}
                </react_2.VStack>
                
                <react_2.Divider />
                
                {/* Account Information */}
                <react_2.VStack align="stretch" spacing={4} w="full">
                  <react_2.Heading as="h3" size="md" color="gray.700">Account Details</react_2.Heading>
                  <react_2.VStack align="stretch" spacing={3}>
                    <react_2.HStack justify="space-between">
                      <react_2.Text fontWeight="medium" color="gray.600">Email:</react_2.Text>
                      <react_2.Text>{currentUser?.email}</react_2.Text>
                    </react_2.HStack>
                    <react_2.HStack justify="space-between">
                      <react_2.Text fontWeight="medium" color="gray.600">Member since:</react_2.Text>
                      <react_2.Text>{formatDate(currentUser?.uid ? new Date().toISOString() : undefined)}</react_2.Text>
                    </react_2.HStack>
                    <react_2.HStack justify="space-between">
                      <react_2.Text fontWeight="medium" color="gray.600">Email verified:</react_2.Text>
                      <react_2.Badge colorScheme={currentUser?.email ? 'green' : 'red'} variant="subtle">
                        {currentUser?.email ? 'Verified' : 'Not verified'}
                      </react_2.Badge>
                    </react_2.HStack>
                  </react_2.VStack>
                </react_2.VStack>
              </react_2.VStack>
            </react_2.CardBody>
          </react_2.Card>
        </react_2.GridItem>
        
        {/* Learning Progress */}
        <react_2.GridItem>
          <react_2.VStack spacing={6} align="stretch">
            {/* Stats Overview */}
            <react_2.Card bg={cardBg} boxShadow="lg" borderRadius="xl">
              <react_2.CardHeader>
                <react_2.Heading size="lg" color="brand.600">Learning Statistics</react_2.Heading>
              </react_2.CardHeader>
              <react_2.CardBody>
                {isLoadingProgress ? (<react_2.SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                    {Array(4).fill(0).map((_, i) => (<react_2.Skeleton key={i} height="100px" borderRadius="lg"/>))}
                  </react_2.SimpleGrid>) : hasError ? (<react_2.Alert status="error" borderRadius="lg">
                    <react_2.AlertIcon />
                    <react_2.AlertTitle mr={2}>Connection Error</react_2.AlertTitle>
                    <react_2.AlertDescription>
                      Unable to load your learning statistics. Please check your connection and try again.
                    </react_2.AlertDescription>
                  </react_2.Alert>) : progressData ? (<react_2.SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                    <react_2.Card bg={statBg} borderRadius="lg">
                      <react_2.CardBody textAlign="center">
                        <react_2.Stat>
                          <react_2.HStack justify="center" mb={2}>
                            <react_2.Icon as={fi_1.FiBook} color="blue.500" boxSize={6}/>
                          </react_2.HStack>
                          <react_2.StatNumber fontSize="2xl" color="blue.500">
                            {progressData.completed_lessons?.length || 0}
                          </react_2.StatNumber>
                          <react_2.StatLabel fontSize="sm">Lessons Completed</react_2.StatLabel>
                        </react_2.Stat>
                      </react_2.CardBody>
                    </react_2.Card>
                    
                    <react_2.Card bg={statBg} borderRadius="lg">
                      <react_2.CardBody textAlign="center">
                        <react_2.Stat>
                          <react_2.HStack justify="center" mb={2}>
                            <react_2.Icon as={fi_1.FiClock} color="green.500" boxSize={6}/>
                          </react_2.HStack>
                          <react_2.StatNumber fontSize="2xl" color="green.500">
                            {formatTime(Math.floor((progressData.total_time_spent || 0) / 60))}
                          </react_2.StatNumber>
                          <react_2.StatLabel fontSize="sm">Study Time</react_2.StatLabel>
                        </react_2.Stat>
                      </react_2.CardBody>
                    </react_2.Card>
                    
                    <react_2.Card bg={statBg} borderRadius="lg">
                      <react_2.CardBody textAlign="center">
                        <react_2.Stat>
                          <react_2.HStack justify="center" mb={2}>
                            <react_2.Icon as={fi_1.FiHelpCircle} color="purple.500" boxSize={6}/>
                          </react_2.HStack>
                          <react_2.StatNumber fontSize="2xl" color="purple.500">
                            {progressData.statistics?.questions_asked || 0}
                          </react_2.StatNumber>
                          <react_2.StatLabel fontSize="sm">Questions Asked</react_2.StatLabel>
                        </react_2.Stat>
                      </react_2.CardBody>
                    </react_2.Card>
                    
                    <react_2.Card bg={statBg} borderRadius="lg">
                      <react_2.CardBody textAlign="center">
                        <react_2.Stat>
                          <react_2.HStack justify="center" mb={2}>
                            <react_2.Icon as={fi_1.FiTrendingUp} color="orange.500" boxSize={6}/>
                          </react_2.HStack>
                          <react_2.StatNumber fontSize="2xl" color="orange.500">
                            {progressData.statistics?.streak || 0}
                          </react_2.StatNumber>
                          <react_2.StatLabel fontSize="sm">Day Streak</react_2.StatLabel>
                        </react_2.Stat>
                      </react_2.CardBody>
                    </react_2.Card>
                  </react_2.SimpleGrid>) : (<react_2.VStack spacing={6} textAlign="center" py={8} color="gray.500">
                    <react_2.Icon as={fi_1.FiBook} boxSize={12}/>
                    <react_2.VStack spacing={2}>
                      <react_2.Text fontWeight="medium">No learning data yet</react_2.Text>
                      <react_2.Text fontSize="sm">
                        Start taking lessons to see your progress here!
                      </react_2.Text>
                    </react_2.VStack>
                    <react_2.Button leftIcon={<fi_1.FiBook />} colorScheme="brand" variant="outline" size="sm" onClick={() => window.location.href = '/lessons'}>
                      Browse Lessons
                    </react_2.Button>
                  </react_2.VStack>)}
              </react_2.CardBody>
            </react_2.Card>

            {/* Weekly Goal Progress */}
            {progressData && !hasError && (<react_2.Card bg={cardBg} boxShadow="lg" borderRadius="xl">
                <react_2.CardHeader>
                  <react_2.HStack justify="space-between">
                    <react_2.Heading size="lg" color="brand.600">Weekly Goal</react_2.Heading>
                    <react_2.Icon as={fi_1.FiTarget} color="brand.500" boxSize={6}/>
                  </react_2.HStack>
                </react_2.CardHeader>
                <react_2.CardBody>
                  <react_2.VStack spacing={4} align="stretch">
                    <react_2.HStack justify="space-between">
                      <react_2.Text fontSize="lg" fontWeight="medium">
                        {weeklyProgress} of {weeklyGoal} lessons
                      </react_2.Text>
                      <react_2.Badge colorScheme={progressPercentage >= 100 ? 'green' : 'blue'} variant="subtle" px={3} py={1}>
                        {Math.round(progressPercentage)}%
                      </react_2.Badge>
                    </react_2.HStack>
                    <react_2.Progress value={progressPercentage} colorScheme={progressPercentage >= 100 ? 'green' : 'brand'} size="lg" borderRadius="full" bg="gray.100"/>
                    <react_2.Text fontSize="sm" color="gray.600">
                      {progressPercentage >= 100
                ? '🎉 Goal achieved! Keep up the great work!'
                : `${weeklyGoal - weeklyProgress} more lessons to reach your goal`}
                    </react_2.Text>
                  </react_2.VStack>
                </react_2.CardBody>
              </react_2.Card>)}

            {/* Recent Activity */}
            {progressData?.completed_lessons && progressData.completed_lessons.length > 0 && !hasError && (<react_2.Card bg={cardBg} boxShadow="lg" borderRadius="xl">
                <react_2.CardHeader>
                  <react_2.HStack justify="space-between">
                    <react_2.Heading size="lg" color="brand.600">Recent Completions</react_2.Heading>
                    <react_2.Icon as={fi_1.FiAward} color="brand.500" boxSize={6}/>
                  </react_2.HStack>
                </react_2.CardHeader>
                <react_2.CardBody>
                  <react_2.VStack spacing={4} align="stretch">
                    {progressData.completed_lessons.slice(0, 5).map((lesson, index) => (<react_2.HStack key={index} p={4} bg={statBg} borderRadius="lg" justify="space-between">
                        <react_2.VStack align="start" spacing={1}>
                          <react_2.Text fontWeight="medium" noOfLines={1}>
                            {lesson.title}
                          </react_2.Text>
                          <react_2.Text fontSize="sm" color="gray.500">
                            Completed: {formatDate(lesson.completion_date)}
                          </react_2.Text>
                        </react_2.VStack>
                        {lesson.score !== undefined && (<react_2.Badge colorScheme={lesson.score >= 80 ? 'green' : lesson.score >= 60 ? 'yellow' : 'red'} variant="subtle" px={3} py={1}>
                            {Math.round(lesson.score)}%
                          </react_2.Badge>)}
                      </react_2.HStack>))}
                  </react_2.VStack>
                </react_2.CardBody>
              </react_2.Card>)}
          </react_2.VStack>
        </react_2.GridItem>
      </react_2.Grid>
    </react_2.Container>);
};
exports.default = Profile;
//# sourceMappingURL=Profile.js.map