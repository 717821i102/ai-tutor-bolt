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
const recharts_1 = require("recharts");
const api_1 = __importDefault(require("../services/api"));
const Analytics = () => {
    const [analyticsData, setAnalyticsData] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const [timeRange, setTimeRange] = (0, react_1.useState)('30d');
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const fetchAnalytics = react_1.default.useCallback(async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await api_1.default.get(`/analytics/dashboard?range=${timeRange}`);
            setAnalyticsData(response.data);
        }
        catch (error) {
            console.error('Failed to fetch analytics:', error);
            setHasError(true);
            // Set mock data for demonstration
            setAnalyticsData({
                overview: {
                    total_lessons_completed: 24,
                    total_time_spent: 1440, // minutes
                    total_questions_asked: 156,
                    current_streak: 7,
                    average_score: 87.5,
                    lessons_this_week: 5,
                    lessons_this_month: 18,
                    improvement_rate: 12.5,
                },
                daily_activity: [
                    { date: '2024-01-01', lessons_completed: 2, time_spent: 60, questions_asked: 8 },
                    { date: '2024-01-02', lessons_completed: 1, time_spent: 45, questions_asked: 5 },
                    { date: '2024-01-03', lessons_completed: 3, time_spent: 90, questions_asked: 12 },
                    { date: '2024-01-04', lessons_completed: 2, time_spent: 75, questions_asked: 9 },
                    { date: '2024-01-05', lessons_completed: 1, time_spent: 30, questions_asked: 4 },
                    { date: '2024-01-06', lessons_completed: 4, time_spent: 120, questions_asked: 15 },
                    { date: '2024-01-07', lessons_completed: 2, time_spent: 60, questions_asked: 7 },
                ],
                subject_breakdown: [
                    { subject: 'Mathematics', lessons_completed: 8, time_spent: 480, average_score: 92 },
                    { subject: 'Physics', lessons_completed: 6, time_spent: 360, average_score: 85 },
                    { subject: 'Programming', lessons_completed: 5, time_spent: 300, average_score: 88 },
                    { subject: 'Chemistry', lessons_completed: 3, time_spent: 180, average_score: 82 },
                    { subject: 'Biology', lessons_completed: 2, time_spent: 120, average_score: 90 },
                ],
                difficulty_progress: [
                    { difficulty: 'Beginner', completed: 12, total: 15, percentage: 80 },
                    { difficulty: 'Intermediate', completed: 8, total: 12, percentage: 67 },
                    { difficulty: 'Advanced', completed: 4, total: 10, percentage: 40 },
                ],
                weekly_goals: {
                    current_week: 5,
                    goal: 7,
                    completion_rate: 71,
                    streak: 3,
                },
                learning_trends: [
                    { week: 'Week 1', lessons: 8, time: 240, score: 82 },
                    { week: 'Week 2', lessons: 10, time: 300, score: 85 },
                    { week: 'Week 3', lessons: 12, time: 360, score: 88 },
                    { week: 'Week 4', lessons: 15, time: 450, score: 90 },
                ],
            });
        }
        finally {
            setIsLoading(false);
        }
    }, [timeRange]);
    (0, react_1.useEffect)(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };
    const COLORS = ['#3182CE', '#805AD5', '#38A169', '#F59E0B', '#EF4444'];
    if (isLoading) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.VStack spacing={8} align="stretch">
          <react_2.Skeleton height="60px"/>
          <react_2.SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {Array(4).fill(0).map((_, i) => (<react_2.Skeleton key={i} height="120px" borderRadius="xl"/>))}
          </react_2.SimpleGrid>
          <react_2.SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <react_2.Skeleton height="400px" borderRadius="xl"/>
            <react_2.Skeleton height="400px" borderRadius="xl"/>
          </react_2.SimpleGrid>
        </react_2.VStack>
      </react_2.Container>);
    }
    if (hasError && !analyticsData) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.Alert status="error" borderRadius="lg">
          <react_2.AlertIcon />
          <react_2.AlertTitle mr={2}>Unable to load analytics</react_2.AlertTitle>
          <react_2.AlertDescription>
            There was an error loading your learning analytics. Please try again.
          </react_2.AlertDescription>
        </react_2.Alert>
        <react_2.Button mt={4} leftIcon={<fi_1.FiRefreshCw />} onClick={fetchAnalytics} colorScheme="brand">
          Retry
        </react_2.Button>
      </react_2.Container>);
    }
    return (<react_2.Container maxW="container.xl" py={8}>
      <react_2.VStack spacing={8} align="stretch">
        {/* Header */}
        <react_2.Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <react_2.VStack align="start" spacing={2}>
            <react_2.Heading as="h1" size="2xl" color="brand.600">
              Learning Analytics
            </react_2.Heading>
            <react_2.Text color="gray.600" fontSize="lg">
              Track your progress and insights
            </react_2.Text>
          </react_2.VStack>
          
          <react_2.HStack spacing={4}>
            <react_2.Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} w="auto">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </react_2.Select>
            <react_2.Button leftIcon={<fi_1.FiRefreshCw />} onClick={fetchAnalytics} variant="outline">
              Refresh
            </react_2.Button>
          </react_2.HStack>
        </react_2.Flex>

        {hasError && (<react_2.Alert status="warning" borderRadius="lg">
            <react_2.AlertIcon />
            <react_2.AlertTitle mr={2}>Limited Data</react_2.AlertTitle>
            <react_2.AlertDescription>
              Showing sample data. Connect to the backend for real analytics.
            </react_2.AlertDescription>
          </react_2.Alert>)}

        {/* Overview Stats */}
        <react_2.SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardBody>
              <react_2.Stat>
                <react_2.HStack mb={2}>
                  <react_2.Icon as={fi_1.FiBook} color="blue.500" boxSize={6}/>
                </react_2.HStack>
                <react_2.StatNumber fontSize="2xl" color="blue.500">
                  {analyticsData?.overview.total_lessons_completed || 0}
                </react_2.StatNumber>
                <react_2.StatLabel>Lessons Completed</react_2.StatLabel>
                <react_2.StatHelpText>
                  <react_2.StatArrow type="increase"/>
                  {analyticsData?.overview.improvement_rate || 0}% this month
                </react_2.StatHelpText>
              </react_2.Stat>
            </react_2.CardBody>
          </react_2.Card>

          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardBody>
              <react_2.Stat>
                <react_2.HStack mb={2}>
                  <react_2.Icon as={fi_1.FiClock} color="green.500" boxSize={6}/>
                </react_2.HStack>
                <react_2.StatNumber fontSize="2xl" color="green.500">
                  {formatTime(analyticsData?.overview.total_time_spent || 0)}
                </react_2.StatNumber>
                <react_2.StatLabel>Total Study Time</react_2.StatLabel>
                <react_2.StatHelpText>
                  {analyticsData?.overview.lessons_this_week || 0} lessons this week
                </react_2.StatHelpText>
              </react_2.Stat>
            </react_2.CardBody>
          </react_2.Card>

          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardBody>
              <react_2.Stat>
                <react_2.HStack mb={2}>
                  <react_2.Icon as={fi_1.FiHelpCircle} color="purple.500" boxSize={6}/>
                </react_2.HStack>
                <react_2.StatNumber fontSize="2xl" color="purple.500">
                  {analyticsData?.overview.total_questions_asked || 0}
                </react_2.StatNumber>
                <react_2.StatLabel>Questions Asked</react_2.StatLabel>
                <react_2.StatHelpText>AI interactions</react_2.StatHelpText>
              </react_2.Stat>
            </react_2.CardBody>
          </react_2.Card>

          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardBody>
              <react_2.Stat>
                <react_2.HStack mb={2}>
                  <react_2.Icon as={fi_1.FiTarget} color="orange.500" boxSize={6}/>
                </react_2.HStack>
                <react_2.StatNumber fontSize="2xl" color="orange.500">
                  {analyticsData?.overview.average_score || 0}%
                </react_2.StatNumber>
                <react_2.StatLabel>Average Score</react_2.StatLabel>
                <react_2.StatHelpText>
                  🔥 {analyticsData?.overview.current_streak || 0} day streak
                </react_2.StatHelpText>
              </react_2.Stat>
            </react_2.CardBody>
          </react_2.Card>
        </react_2.SimpleGrid>

        {/* Charts Grid */}
        <react_2.SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Daily Activity Chart */}
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardHeader>
              <react_2.HStack>
                <react_2.Icon as={fi_1.FiActivity} color="brand.500"/>
                <react_2.Heading size="md">Daily Activity</react_2.Heading>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody>
              <recharts_1.ResponsiveContainer width="100%" height={300}>
                <recharts_1.AreaChart data={analyticsData?.daily_activity || []}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="date"/>
                  <recharts_1.YAxis />
                  <recharts_1.Tooltip />
                  <recharts_1.Area type="monotone" dataKey="lessons_completed" stackId="1" stroke="#3182CE" fill="#3182CE" fillOpacity={0.6}/>
                  <recharts_1.Area type="monotone" dataKey="time_spent" stackId="2" stroke="#805AD5" fill="#805AD5" fillOpacity={0.6}/>
                </recharts_1.AreaChart>
              </recharts_1.ResponsiveContainer>
            </react_2.CardBody>
          </react_2.Card>

          {/* Subject Breakdown */}
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardHeader>
              <react_2.HStack>
                <react_2.Icon as={fi_1.FiPieChart} color="brand.500"/>
                <react_2.Heading size="md">Subject Breakdown</react_2.Heading>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody>
              <recharts_1.ResponsiveContainer width="100%" height={300}>
                <recharts_1.PieChart>
                  <recharts_1.Pie data={analyticsData?.subject_breakdown || []} cx="50%" cy="50%" labelLine={false} label={({ subject, percentage }) => `${subject} ${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="lessons_completed">
                    {(analyticsData?.subject_breakdown || []).map((entry, index) => (<recharts_1.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                  </recharts_1.Pie>
                  <recharts_1.Tooltip />
                </recharts_1.PieChart>
              </recharts_1.ResponsiveContainer>
            </react_2.CardBody>
          </react_2.Card>

          {/* Learning Trends */}
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardHeader>
              <react_2.HStack>
                <react_2.Icon as={fi_1.FiTrendingUp} color="brand.500"/>
                <react_2.Heading size="md">Learning Trends</react_2.Heading>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody>
              <recharts_1.ResponsiveContainer width="100%" height={300}>
                <recharts_1.LineChart data={analyticsData?.learning_trends || []}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="week"/>
                  <recharts_1.YAxis />
                  <recharts_1.Tooltip />
                  <recharts_1.Line type="monotone" dataKey="lessons" stroke="#3182CE" strokeWidth={3} dot={{ fill: '#3182CE', strokeWidth: 2, r: 6 }}/>
                  <recharts_1.Line type="monotone" dataKey="score" stroke="#38A169" strokeWidth={3} dot={{ fill: '#38A169', strokeWidth: 2, r: 6 }}/>
                </recharts_1.LineChart>
              </recharts_1.ResponsiveContainer>
            </react_2.CardBody>
          </react_2.Card>

          {/* Difficulty Progress */}
          <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardHeader>
              <react_2.HStack>
                <react_2.Icon as={fi_1.FiBarChart} color="brand.500"/>
                <react_2.Heading size="md">Difficulty Progress</react_2.Heading>
              </react_2.HStack>
            </react_2.CardHeader>
            <react_2.CardBody>
              <react_2.VStack spacing={6} align="stretch">
                {(analyticsData?.difficulty_progress || []).map((item, index) => (<react_2.Box key={index}>
                    <react_2.HStack justify="space-between" mb={2}>
                      <react_2.Text fontWeight="medium">{item.difficulty}</react_2.Text>
                      <react_2.Badge colorScheme={item.percentage >= 80 ? 'green' : item.percentage >= 60 ? 'yellow' : 'red'}>
                        {item.completed}/{item.total}
                      </react_2.Badge>
                    </react_2.HStack>
                    <react_2.Progress value={item.percentage} colorScheme={item.percentage >= 80 ? 'green' : item.percentage >= 60 ? 'yellow' : 'red'} size="lg" borderRadius="full"/>
                    <react_2.Text fontSize="sm" color="gray.500" mt={1}>
                      {item.percentage}% complete
                    </react_2.Text>
                  </react_2.Box>))}
              </react_2.VStack>
            </react_2.CardBody>
          </react_2.Card>
        </react_2.SimpleGrid>

        {/* Weekly Goals */}
        <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
          <react_2.CardHeader>
            <react_2.HStack justify="space-between">
              <react_2.HStack>
                <react_2.Icon as={fi_1.FiTarget} color="brand.500"/>
                <react_2.Heading size="md">Weekly Goals</react_2.Heading>
              </react_2.HStack>
              <react_2.Badge colorScheme="brand" variant="subtle" px={3} py={1}>
                Week {getCurrentWeek()}
              </react_2.Badge>
            </react_2.HStack>
          </react_2.CardHeader>
          <react_2.CardBody>
            <react_2.SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <react_2.VStack spacing={4}>
                <react_2.Text fontSize="sm" color="gray.500">Current Progress</react_2.Text>
                <react_2.Box textAlign="center">
                  <react_2.Text fontSize="3xl" fontWeight="bold" color="brand.500">
                    {analyticsData?.weekly_goals.current_week || 0}
                  </react_2.Text>
                  <react_2.Text color="gray.600">of {analyticsData?.weekly_goals.goal || 7} lessons</react_2.Text>
                </react_2.Box>
                <react_2.Progress value={analyticsData?.weekly_goals.completion_rate || 0} colorScheme="brand" size="lg" borderRadius="full" w="full"/>
              </react_2.VStack>

              <react_2.Divider orientation="vertical" display={{ base: 'none', md: 'block' }}/>

              <react_2.VStack spacing={4}>
                <react_2.Text fontSize="sm" color="gray.500">Completion Rate</react_2.Text>
                <react_2.Box textAlign="center">
                  <react_2.Text fontSize="3xl" fontWeight="bold" color="green.500">
                    {analyticsData?.weekly_goals.completion_rate || 0}%
                  </react_2.Text>
                  <react_2.Text color="gray.600">this week</react_2.Text>
                </react_2.Box>
                <react_2.Badge colorScheme="green" variant="subtle" px={3} py={1}>
                  {analyticsData?.weekly_goals.streak || 0} week streak
                </react_2.Badge>
              </react_2.VStack>

              <react_2.Divider orientation="vertical" display={{ base: 'none', md: 'block' }}/>

              <react_2.VStack spacing={4}>
                <react_2.Text fontSize="sm" color="gray.500">Recommendation</react_2.Text>
                <react_2.Box textAlign="center">
                  <react_2.Icon as={fi_1.FiAward} boxSize={8} color="orange.500" mb={2}/>
                  <react_2.Text fontWeight="medium">
                    {(analyticsData?.weekly_goals.completion_rate || 0) >= 100
            ? 'Goal achieved! 🎉'
            : `${(analyticsData?.weekly_goals.goal || 7) - (analyticsData?.weekly_goals.current_week || 0)} more lessons to go`}
                  </react_2.Text>
                </react_2.Box>
              </react_2.VStack>
            </react_2.SimpleGrid>
          </react_2.CardBody>
        </react_2.Card>
      </react_2.VStack>
    </react_2.Container>);
};
// Helper function to get week number
function getCurrentWeek() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
exports.default = Analytics;
//# sourceMappingURL=Analytics.js.map