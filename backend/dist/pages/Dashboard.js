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
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
const api_1 = __importDefault(require("../services/api"));
const Dashboard = () => {
    const { currentUser } = (0, AuthContext_1.useAuth)();
    const [userProgress, setUserProgress] = (0, react_1.useState)(null);
    const [recentActivity, setRecentActivity] = (0, react_1.useState)([]);
    const [recommendedLessons, setRecommendedLessons] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.800');
    const gradientBg = (0, react_2.useColorModeValue)('linear(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', 'linear(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)');
    const textColor = (0, react_2.useColorModeValue)('gray.800', 'gray.100');
    const mutedTextColor = (0, react_2.useColorModeValue)('gray.600', 'gray.400');
    const subtleTextColor = (0, react_2.useColorModeValue)('gray.500', 'gray.500');
    (0, react_1.useEffect)(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setHasError(false);
            try {
                // Fetch user progress
                const progressResponse = await api_1.default.get('/users/me/progress');
                setUserProgress(progressResponse.data);
                // Fetch recent activity
                try {
                    const activityResponse = await api_1.default.get('/users/me/activity?limit=5');
                    setRecentActivity(activityResponse.data.activities || []);
                }
                catch (activityError) {
                    console.warn('No recent activity available:', activityError);
                    setRecentActivity([]);
                }
                // Fetch recommended lessons
                try {
                    const recommendedResponse = await api_1.default.get('/lessons/recommended?limit=3');
                    setRecommendedLessons(recommendedResponse.data.lessons || []);
                }
                catch (recommendedError) {
                    console.warn('No recommended lessons available:', recommendedError);
                    setRecommendedLessons([]);
                }
            }
            catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setHasError(true);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);
    // Format minutes into hours and minutes
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12)
            return 'Good morning';
        if (hour < 18)
            return 'Good afternoon';
        return 'Good evening';
    };
    if (isLoading) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.VStack spacing={8} align="stretch">
          <react_2.Skeleton height="200px" borderRadius="3xl"/>
          <react_2.SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {Array(4).fill(0).map((_, i) => (<react_2.Skeleton key={i} height="120px" borderRadius="2xl"/>))}
          </react_2.SimpleGrid>
          <react_2.Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
            <react_2.GridItem colSpan={{ base: 1, lg: 2 }}>
              <react_2.Skeleton height="400px" borderRadius="2xl"/>
            </react_2.GridItem>
            <react_2.GridItem>
              <react_2.Skeleton height="400px" borderRadius="2xl"/>
            </react_2.GridItem>
          </react_2.Grid>
        </react_2.VStack>
      </react_2.Container>);
    }
    if (hasError) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.Alert status="error" borderRadius="2xl" mb={6} boxShadow="gradient-md">
          <react_2.AlertIcon />
          <react_2.AlertTitle mr={2}>Connection Error</react_2.AlertTitle>
          <react_2.AlertDescription>
            Unable to connect to the AI Tutor service. Please check your internet connection and try again.
          </react_2.AlertDescription>
        </react_2.Alert>
        
        <react_2.VStack spacing={8} textAlign="center">
          <react_2.Icon as={fi_1.FiWifi} boxSize={16} color="red.400"/>
          <react_2.VStack spacing={4}>
            <react_2.Heading size="lg" color="red.500">Service Unavailable</react_2.Heading>
            <react_2.Text color={mutedTextColor} maxW="md">
              The dashboard service is currently unavailable. Please ensure you have an active internet connection and the service is running.
            </react_2.Text>
          </react_2.VStack>
          <react_2.Button leftIcon={<fi_1.FiRefreshCw />} onClick={() => window.location.reload()} colorScheme="brand" size="lg" borderRadius="xl">
            Try Again
          </react_2.Button>
        </react_2.VStack>
      </react_2.Container>);
    }
    const stats = {
        lessonsCompleted: userProgress?.completed_lessons?.length || 0,
        totalTimeSpent: userProgress?.total_time_spent ? Math.floor(userProgress.total_time_spent / 60) : 0,
        questionsAsked: userProgress?.statistics?.questions_asked || 0,
        streak: userProgress?.statistics?.streak || 0,
        weeklyGoal: userProgress?.statistics?.weekly_goal || 5,
        completedThisWeek: userProgress?.statistics?.completed_this_week || 0,
    };
    return (<react_2.Container maxW="container.xl" py={8}>
      {/* Welcome Header */}
      <react_2.Box bgGradient={gradientBg} borderRadius="3xl" p={8} mb={8} position="relative" overflow="hidden" boxShadow="gradient-lg" border="1px solid" borderColor="brand.200">
        <react_2.Box position="relative" zIndex={1}>
          <react_2.HStack justify="space-between" align="start" mb={4}>
            <react_2.VStack align="start" spacing={2}>
              <react_2.Text fontSize="lg" color={mutedTextColor}>
                {getGreeting()}, {currentUser?.displayName?.split(' ')[0] || 'Student'}! 👋
              </react_2.Text>
              <react_2.Heading size="xl" fontWeight="bold" color={textColor}>
                Ready to continue learning?
              </react_2.Heading>
              <react_2.Text color={mutedTextColor} maxW="md">
                {stats.streak > 0
            ? `You're on a ${stats.streak}-day learning streak! Keep it up to reach your weekly goal.`
            : 'Start your learning journey today!'}
              </react_2.Text>
            </react_2.VStack>
            <react_2.VStack align="end" spacing={2}>
              {stats.streak > 0 && (<react_2.Badge variant="gradient" px={4} py={2} borderRadius="full" fontSize="sm">
                  🔥 {stats.streak} Day Streak
                </react_2.Badge>)}
              <react_2.Text fontSize="sm" color={mutedTextColor}>
                {stats.completedThisWeek}/{stats.weeklyGoal} lessons this week
              </react_2.Text>
            </react_2.VStack>
          </react_2.HStack>
          
          {userProgress?.current_lesson ? (<react_2.Card bg="whiteAlpha.200" backdropFilter="blur(10px)" border="1px solid" borderColor="whiteAlpha.300" borderRadius="2xl">
              <react_2.CardBody>
                <react_2.HStack justify="space-between" mb={3}>
                  <react_2.VStack align="start" spacing={1}>
                    <react_2.Text fontSize="sm" color={mutedTextColor}>Continue Learning</react_2.Text>
                    <react_2.Text fontWeight="bold" color={textColor}>{userProgress.current_lesson.title}</react_2.Text>
                  </react_2.VStack>
                  <react_2.Button leftIcon={<fi_1.FiPlay />} colorScheme="whiteAlpha" variant="solid" size="sm" as={react_router_dom_1.Link} to={`/lessons/${userProgress.current_lesson.lesson_id}`} borderRadius="xl">
                    Resume
                  </react_2.Button>
                </react_2.HStack>
                <react_2.Progress value={userProgress.current_lesson.progress * 100} colorScheme="yellow" bg="whiteAlpha.300" borderRadius="full" size="sm"/>
                <react_2.HStack justify="space-between" mt={2} fontSize="sm" color={mutedTextColor}>
                  <react_2.Text>{Math.round(userProgress.current_lesson.progress * 100)}% complete</react_2.Text>
                </react_2.HStack>
              </react_2.CardBody>
            </react_2.Card>) : (<react_2.Card bg="whiteAlpha.200" backdropFilter="blur(10px)" border="1px solid" borderColor="whiteAlpha.300" borderRadius="2xl">
              <react_2.CardBody textAlign="center">
                <react_2.VStack spacing={3}>
                  <react_2.Icon as={fi_1.FiBook} boxSize={8} color={mutedTextColor}/>
                  <react_2.VStack spacing={1}>
                    <react_2.Text fontWeight="bold" color={textColor}>Ready to start learning?</react_2.Text>
                    <react_2.Text fontSize="sm" color={mutedTextColor}>Browse our lessons to begin your journey</react_2.Text>
                  </react_2.VStack>
                  <react_2.Button leftIcon={<fi_1.FiBook />} colorScheme="whiteAlpha" variant="solid" size="sm" as={react_router_dom_1.Link} to="/lessons" borderRadius="xl">
                    Browse Lessons
                  </react_2.Button>
                </react_2.VStack>
              </react_2.CardBody>
            </react_2.Card>)}
        </react_2.Box>
        
        {/* Background decoration */}
        <react_2.Box position="absolute" top="-50%" right="-20%" w="400px" h="400px" borderRadius="full" bgGradient="radial(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)" filter="blur(100px)"/>
      </react_2.Box>
      
      {/* Stats Grid */}
      <react_2.SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
        <StatCard icon={fi_1.FiBook} label="Lessons Completed" value={stats.lessonsCompleted} helpText="Total completed" colorScheme="blue"/>
        <StatCard icon={fi_1.FiClock} label="Learning Time" value={formatTime(stats.totalTimeSpent)} helpText="Total time spent" colorScheme="green"/>
        <StatCard icon={fi_1.FiHelpCircle} label="Questions Asked" value={stats.questionsAsked} helpText="AI interactions" colorScheme="purple"/>
        <StatCard icon={fi_1.FiTarget} label="Weekly Goal" value={`${stats.completedThisWeek}/${stats.weeklyGoal}`} helpText="Lessons this week" colorScheme="orange"/>
      </react_2.SimpleGrid>
      
      <react_2.Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
        {/* Recent Activity */}
        <react_2.GridItem colSpan={{ base: 1, lg: 2 }}>
          <react_2.Card bg={cardBg} h="fit-content" borderRadius="2xl" boxShadow="gradient-md">
            <react_2.CardHeader>
              <react_2.HStack justify="space-between">
                <react_2.HStack>
                  <react_2.Icon as={fi_1.FiTrendingUp} color="brand.500"/>
                  <react_2.Heading size="md" color={textColor}>Recent Activity</react_2.Heading>
                </react_2.HStack>
                <react_2.Button variant="ghost" size="sm" rightIcon={<fi_1.FiChevronRight />} borderRadius="xl">
                  View All
                </react_2.Button>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody pt={0}>
              {recentActivity.length > 0 ? (<react_2.VStack spacing={4} align="stretch">
                  {recentActivity.map((activity, index) => (<ActivityItem key={index} activity={activity}/>))}
                </react_2.VStack>) : (<react_2.VStack spacing={4} py={8} textAlign="center" color={subtleTextColor}>
                  <react_2.Icon as={fi_1.FiTrendingUp} boxSize={12}/>
                  <react_2.VStack spacing={2}>
                    <react_2.Text fontWeight="medium">No recent activity</react_2.Text>
                    <react_2.Text fontSize="sm">
                      Start learning to see your progress here!
                    </react_2.Text>
                  </react_2.VStack>
                  <react_2.Button leftIcon={<fi_1.FiBook />} colorScheme="brand" variant="outline" size="sm" as={react_router_dom_1.Link} to="/lessons" borderRadius="xl">
                    Browse Lessons
                  </react_2.Button>
                </react_2.VStack>)}
            </react_2.CardBody>
          </react_2.Card>
        </react_2.GridItem>
        
        {/* Quick Actions & Recommendations */}
        <react_2.GridItem>
          <react_2.VStack spacing={6} align="stretch">
            {/* Quick Actions */}
            <react_2.Card bg={cardBg} borderRadius="2xl" boxShadow="gradient-md">
              <react_2.CardHeader>
                <react_2.Heading size="md" color={textColor}>Quick Actions</react_2.Heading>
              </react_2.CardHeader>
              <react_2.CardBody pt={0}>
                <react_2.VStack spacing={3} align="stretch">
                  <react_2.Button leftIcon={<fi_1.FiBook />} colorScheme="brand" variant="outline" justifyContent="flex-start" as={react_router_dom_1.Link} to="/lessons" borderRadius="xl">
                    Browse Lessons
                  </react_2.Button>
                  <react_2.Button leftIcon={<fi_1.FiHelpCircle />} colorScheme="purple" variant="outline" justifyContent="flex-start" as={react_router_dom_1.Link} to="/qa" borderRadius="xl">
                    Ask AI Tutor
                  </react_2.Button>
                  <react_2.Button leftIcon={<fi_1.FiCalendar />} colorScheme="green" variant="outline" justifyContent="flex-start" borderRadius="xl">
                    Schedule Study Time
                  </react_2.Button>
                </react_2.VStack>
              </react_2.CardBody>
            </react_2.Card>

            {/* Recommended Lessons */}
            <react_2.Card bg={cardBg} borderRadius="2xl" boxShadow="gradient-md">
              <react_2.CardHeader>
                <react_2.Heading size="md" color={textColor}>Recommended for You</react_2.Heading>
              </react_2.CardHeader>
              <react_2.CardBody pt={0}>
                {recommendedLessons.length > 0 ? (<react_2.VStack spacing={4} align="stretch">
                    {recommendedLessons.map((lesson) => (<RecommendedLessonCard key={lesson.id} lesson={lesson}/>))}
                  </react_2.VStack>) : (<react_2.VStack spacing={4} py={6} textAlign="center" color={subtleTextColor}>
                    <react_2.Icon as={fi_1.FiBook} boxSize={10}/>
                    <react_2.VStack spacing={2}>
                      <react_2.Text fontWeight="medium" fontSize="sm">No recommendations yet</react_2.Text>
                      <react_2.Text fontSize="xs">
                        Complete lessons to get personalized recommendations!
                      </react_2.Text>
                    </react_2.VStack>
                  </react_2.VStack>)}
              </react_2.CardBody>
              <react_2.CardFooter pt={0}>
                <react_2.Button variant="ghost" size="sm" width="full" rightIcon={<fi_1.FiChevronRight />} as={react_router_dom_1.Link} to="/lessons" borderRadius="xl">
                  View All Lessons
                </react_2.Button>
              </react_2.CardFooter>
            </react_2.Card>

            {/* Achievement */}
            {stats.lessonsCompleted >= 10 && (<react_2.Card bg={cardBg} borderColor="yellow.200" borderWidth="2px" borderRadius="2xl" boxShadow="gradient-md">
                <react_2.CardBody textAlign="center">
                  <react_2.Icon as={fi_1.FiAward} boxSize={8} color="yellow.500" mb={2}/>
                  <react_2.Text fontWeight="bold" mb={1} color={textColor}>Achievement Unlocked!</react_2.Text>
                  <react_2.Text fontSize="sm" color={mutedTextColor}>
                    Completed {stats.lessonsCompleted}+ lessons!
                  </react_2.Text>
                </react_2.CardBody>
              </react_2.Card>)}
          </react_2.VStack>
        </react_2.GridItem>
      </react_2.Grid>
    </react_2.Container>);
};
const StatCard = ({ icon, label, value, helpText, colorScheme }) => {
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.800');
    const textColor = (0, react_2.useColorModeValue)('gray.800', 'gray.100');
    const mutedTextColor = (0, react_2.useColorModeValue)('gray.600', 'gray.400');
    return (<react_2.Card bg={cardBg} borderRadius="2xl" boxShadow="gradient-md">
      <react_2.CardBody>
        <react_2.Stat>
          <react_2.HStack mb={2}>
            <react_2.Icon as={icon} color={`${colorScheme}.500`} boxSize={5}/>
            <react_2.StatLabel fontSize="sm" fontWeight="medium" color={textColor}>{label}</react_2.StatLabel>
          </react_2.HStack>
          <react_2.StatNumber fontSize="2xl" fontWeight="bold" bgGradient="linear(135deg, #A855F7 0%, #3B82F6 100%)" bgClip="text">
            {value}
          </react_2.StatNumber>
          <react_2.StatHelpText fontSize="xs" color={mutedTextColor}>{helpText}</react_2.StatHelpText>
        </react_2.Stat>
      </react_2.CardBody>
    </react_2.Card>);
};
const ActivityItem = ({ activity }) => {
    const textColor = (0, react_2.useColorModeValue)('gray.800', 'gray.100');
    const mutedTextColor = (0, react_2.useColorModeValue)('gray.500', 'gray.500');
    const getActivityIcon = (type) => {
        switch (type) {
            case 'lesson_completed':
                return { icon: fi_1.FiBook, color: 'green.500' };
            case 'question_asked':
                return { icon: fi_1.FiHelpCircle, color: 'blue.500' };
            case 'lesson_started':
                return { icon: fi_1.FiPlay, color: 'purple.500' };
            default:
                return { icon: fi_1.FiBook, color: 'gray.500' };
        }
    };
    const { icon, color } = getActivityIcon(activity.type);
    return (<react_2.HStack spacing={3} p={3} borderRadius="xl" _hover={{ bg: (0, react_2.useColorModeValue)('gray.50', 'gray.700') }}>
      <react_2.Icon as={icon} color={color} boxSize={5}/>
      <react_2.VStack align="start" spacing={0} flex={1}>
        <react_2.Text fontWeight="medium" fontSize="sm" color={textColor}>{activity.title}</react_2.Text>
        <react_2.Text fontSize="xs" color={mutedTextColor}>{activity.time}</react_2.Text>
      </react_2.VStack>
      {activity.score && (<react_2.Badge variant="gradient" borderRadius="full">
          {activity.score}%
        </react_2.Badge>)}
    </react_2.HStack>);
};
const RecommendedLessonCard = ({ lesson }) => {
    const textColor = (0, react_2.useColorModeValue)('gray.800', 'gray.100');
    const mutedTextColor = (0, react_2.useColorModeValue)('gray.500', 'gray.500');
    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'green';
            case 'intermediate':
                return 'blue';
            case 'advanced':
                return 'purple';
            default:
                return 'gray';
        }
    };
    return (<react_2.HStack spacing={3} p={3} borderRadius="xl" _hover={{ bg: (0, react_2.useColorModeValue)('gray.50', 'gray.700') }} cursor="pointer" transition="all 0.2s" as={react_router_dom_1.Link} to={`/lessons/${lesson.id}`}>
      <react_2.Box w="50px" h="50px" borderRadius="xl" bgGradient="linear(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)" display="flex" alignItems="center" justifyContent="center" flexShrink={0} border="1px solid" borderColor="brand.200">
        <react_2.Icon as={fi_1.FiBook} color="brand.500"/>
      </react_2.Box>
      <react_2.VStack align="start" spacing={1} flex={1}>
        <react_2.Text fontWeight="medium" fontSize="sm" noOfLines={2} color={textColor}>
          {lesson.title}
        </react_2.Text>
        <react_2.HStack spacing={2}>
          <react_2.Badge colorScheme={getDifficultyColor(lesson.difficulty)} size="sm" borderRadius="full">
            {lesson.difficulty}
          </react_2.Badge>
          <react_2.Text fontSize="xs" color={mutedTextColor}>
            {lesson.duration_minutes} min
          </react_2.Text>
        </react_2.HStack>
      </react_2.VStack>
    </react_2.HStack>);
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map