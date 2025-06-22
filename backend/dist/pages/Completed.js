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
const api_1 = __importDefault(require("../services/api"));
const Completed = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const [completedLessons, setCompletedLessons] = (0, react_1.useState)([]);
    const [stats, setStats] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [subjectFilter, setSubjectFilter] = (0, react_1.useState)('');
    const [difficultyFilter, setDifficultyFilter] = (0, react_1.useState)('');
    const [sortBy, setSortBy] = (0, react_1.useState)('completed_at');
    (0, react_1.useEffect)(() => {
        fetchCompletedLessons();
    }, []);
    const fetchCompletedLessons = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const [lessonsResponse, statsResponse] = await Promise.all([
                api_1.default.get('/users/me/completed-lessons'),
                api_1.default.get('/users/me/completion-stats')
            ]);
            setCompletedLessons(lessonsResponse.data.lessons || []);
            setStats(statsResponse.data);
        }
        catch (error) {
            console.error('Failed to fetch completed lessons:', error);
            setHasError(true);
            // Mock data for demonstration
            const mockLessons = [
                {
                    id: '1',
                    title: 'Introduction to Linear Algebra',
                    subject: 'Mathematics',
                    topic: 'Linear Algebra',
                    difficulty: 'intermediate',
                    duration_minutes: 45,
                    completed_at: '2024-01-15T10:30:00Z',
                    score: 92,
                    time_spent: 48,
                    attempts: 1,
                    tags: ['algebra', 'vectors', 'matrices'],
                    certificate_earned: true,
                },
                {
                    id: '2',
                    title: 'Quantum Mechanics Basics',
                    subject: 'Physics',
                    topic: 'Quantum Physics',
                    difficulty: 'advanced',
                    duration_minutes: 60,
                    completed_at: '2024-01-14T14:20:00Z',
                    score: 88,
                    time_spent: 65,
                    attempts: 2,
                    tags: ['quantum', 'physics', 'mechanics'],
                    certificate_earned: true,
                },
                {
                    id: '3',
                    title: 'React Hooks Deep Dive',
                    subject: 'Programming',
                    topic: 'React',
                    difficulty: 'intermediate',
                    duration_minutes: 40,
                    completed_at: '2024-01-13T16:45:00Z',
                    score: 95,
                    time_spent: 42,
                    attempts: 1,
                    tags: ['react', 'hooks', 'javascript'],
                    certificate_earned: true,
                },
                {
                    id: '4',
                    title: 'Organic Chemistry Fundamentals',
                    subject: 'Chemistry',
                    topic: 'Organic Chemistry',
                    difficulty: 'beginner',
                    duration_minutes: 35,
                    completed_at: '2024-01-12T09:15:00Z',
                    score: 78,
                    time_spent: 40,
                    attempts: 1,
                    tags: ['chemistry', 'organic', 'molecules'],
                    certificate_earned: false,
                },
                {
                    id: '5',
                    title: 'Machine Learning Algorithms',
                    subject: 'Computer Science',
                    topic: 'Machine Learning',
                    difficulty: 'advanced',
                    duration_minutes: 75,
                    completed_at: '2024-01-11T11:00:00Z',
                    score: 85,
                    time_spent: 80,
                    attempts: 1,
                    tags: ['ml', 'algorithms', 'ai'],
                    certificate_earned: true,
                },
            ];
            const mockStats = {
                total_completed: 24,
                total_time_spent: 1440,
                average_score: 87.2,
                certificates_earned: 18,
                subjects_mastered: 5,
                completion_streak: 7,
                this_month: 12,
                this_week: 3,
            };
            setCompletedLessons(mockLessons);
            setStats(mockStats);
        }
        finally {
            setIsLoading(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };
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
    const getScoreColor = (score) => {
        if (score >= 90)
            return 'green';
        if (score >= 80)
            return 'blue';
        if (score >= 70)
            return 'yellow';
        return 'red';
    };
    // Filter and sort lessons
    const filteredLessons = completedLessons
        .filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = !subjectFilter || lesson.subject === subjectFilter;
        const matchesDifficulty = !difficultyFilter || lesson.difficulty === difficultyFilter;
        return matchesSearch && matchesSubject && matchesDifficulty;
    })
        .sort((a, b) => {
        switch (sortBy) {
            case 'score':
                return b.score - a.score;
            case 'title':
                return a.title.localeCompare(b.title);
            case 'subject':
                return a.subject.localeCompare(b.subject);
            case 'completed_at':
            default:
                return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
        }
    });
    const subjects = Array.from(new Set(completedLessons.map(lesson => lesson.subject)));
    if (isLoading) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.VStack spacing={8} align="stretch">
          <react_2.Skeleton height="60px"/>
          <react_2.SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {Array(4).fill(0).map((_, i) => (<react_2.Skeleton key={i} height="120px" borderRadius="xl"/>))}
          </react_2.SimpleGrid>
          <react_2.Skeleton height="400px" borderRadius="xl"/>
        </react_2.VStack>
      </react_2.Container>);
    }
    return (<react_2.Container maxW="container.xl" py={8}>
      <react_2.VStack spacing={8} align="stretch">
        {/* Header */}
        <react_2.Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <react_2.VStack align="start" spacing={2}>
            <react_2.Heading as="h1" size="2xl" color="brand.600">
              Completed Lessons
            </react_2.Heading>
            <react_2.Text color="gray.600" fontSize="lg">
              Review your learning achievements and progress
            </react_2.Text>
          </react_2.VStack>
          
          <react_2.HStack spacing={4}>
            <react_2.Button leftIcon={<fi_1.FiDownload />} variant="outline">
              Export
            </react_2.Button>
            <react_2.Button leftIcon={<fi_1.FiRefreshCw />} onClick={fetchCompletedLessons} variant="outline">
              Refresh
            </react_2.Button>
          </react_2.HStack>
        </react_2.Flex>

        {hasError && (<react_2.Alert status="warning" borderRadius="lg">
            <react_2.AlertIcon />
            <react_2.AlertTitle mr={2}>Limited Data</react_2.AlertTitle>
            <react_2.AlertDescription>
              Showing sample data. Connect to the backend for real completion history.
            </react_2.AlertDescription>
          </react_2.Alert>)}

        {/* Stats Overview */}
        {stats && (<react_2.SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
              <react_2.CardBody>
                <react_2.Stat>
                  <react_2.HStack mb={2}>
                    <react_2.Icon as={fi_1.FiBook} color="blue.500" boxSize={6}/>
                  </react_2.HStack>
                  <react_2.StatNumber fontSize="2xl" color="blue.500">
                    {stats.total_completed}
                  </react_2.StatNumber>
                  <react_2.StatLabel>Total Completed</react_2.StatLabel>
                  <react_2.StatHelpText>
                    {stats.this_month} this month
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
                    {formatTime(stats.total_time_spent)}
                  </react_2.StatNumber>
                  <react_2.StatLabel>Total Time</react_2.StatLabel>
                  <react_2.StatHelpText>
                    Learning time invested
                  </react_2.StatHelpText>
                </react_2.Stat>
              </react_2.CardBody>
            </react_2.Card>

            <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
              <react_2.CardBody>
                <react_2.Stat>
                  <react_2.HStack mb={2}>
                    <react_2.Icon as={fi_1.FiTarget} color="purple.500" boxSize={6}/>
                  </react_2.HStack>
                  <react_2.StatNumber fontSize="2xl" color="purple.500">
                    {stats.average_score}%
                  </react_2.StatNumber>
                  <react_2.StatLabel>Average Score</react_2.StatLabel>
                  <react_2.StatHelpText>
                    Across all lessons
                  </react_2.StatHelpText>
                </react_2.Stat>
              </react_2.CardBody>
            </react_2.Card>

            <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
              <react_2.CardBody>
                <react_2.Stat>
                  <react_2.HStack mb={2}>
                    <react_2.Icon as={fi_1.FiAward} color="orange.500" boxSize={6}/>
                  </react_2.HStack>
                  <react_2.StatNumber fontSize="2xl" color="orange.500">
                    {stats.certificates_earned}
                  </react_2.StatNumber>
                  <react_2.StatLabel>Certificates</react_2.StatLabel>
                  <react_2.StatHelpText>
                    🔥 {stats.completion_streak} day streak
                  </react_2.StatHelpText>
                </react_2.Stat>
              </react_2.CardBody>
            </react_2.Card>
          </react_2.SimpleGrid>)}

        {/* Filters */}
        <react_2.Card bg={cardBg} borderRadius="xl" boxShadow="sm">
          <react_2.CardBody>
            <react_2.HStack spacing={4} wrap="wrap">
              <react_2.InputGroup flex={2} minW="250px">
                <react_2.InputLeftElement pointerEvents="none">
                  <react_2.Icon as={fi_1.FiSearch} color="gray.400"/>
                </react_2.InputLeftElement>
                <react_2.Input placeholder="Search completed lessons..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              </react_2.InputGroup>
              
              <react_2.Select placeholder="All Subjects" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} maxW="200px">
                {subjects.map(subject => (<option key={subject} value={subject}>{subject}</option>))}
              </react_2.Select>
              
              <react_2.Select placeholder="All Difficulties" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} maxW="200px">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </react_2.Select>
              
              <react_2.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} maxW="200px">
                <option value="completed_at">Recently Completed</option>
                <option value="score">Highest Score</option>
                <option value="title">Title A-Z</option>
                <option value="subject">Subject</option>
              </react_2.Select>
            </react_2.HStack>
          </react_2.CardBody>
        </react_2.Card>

        {/* Completed Lessons Grid */}
        {filteredLessons.length > 0 ? (<react_2.SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredLessons.map(lesson => (<react_2.Card key={lesson.id} bg={cardBg} borderRadius="xl" boxShadow="lg" transition="all 0.2s" _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }} cursor="pointer" onClick={() => navigate(`/lessons/${lesson.id}`)}>
                <react_2.CardHeader pb={3}>
                  <react_2.VStack align="stretch" spacing={3}>
                    <react_2.HStack justify="space-between">
                      <react_2.Badge colorScheme={getDifficultyColor(lesson.difficulty)} variant="subtle" px={2} py={1}>
                        {lesson.difficulty}
                      </react_2.Badge>
                      <react_2.Menu>
                        <react_2.MenuButton as={react_2.Button} variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <react_2.Icon as={fi_1.FiMoreVertical}/>
                        </react_2.MenuButton>
                        <react_2.MenuList>
                          <react_2.MenuItem icon={<fi_1.FiBook />}>
                            Retake Lesson
                          </react_2.MenuItem>
                          <react_2.MenuItem icon={<fi_1.FiShare2 />}>
                            Share Achievement
                          </react_2.MenuItem>
                          <react_2.MenuItem icon={<fi_1.FiDownload />}>
                            Download Certificate
                          </react_2.MenuItem>
                        </react_2.MenuList>
                      </react_2.Menu>
                    </react_2.HStack>
                    
                    <react_2.Heading as="h3" size="md" noOfLines={2}>
                      {lesson.title}
                    </react_2.Heading>
                    
                    <react_2.HStack spacing={2}>
                      <react_2.Badge colorScheme="blue" variant="outline">
                        {lesson.subject}
                      </react_2.Badge>
                      {lesson.certificate_earned && (<react_2.Tooltip label="Certificate earned">
                          <react_2.Badge colorScheme="yellow" variant="solid">
                            <react_2.Icon as={fi_1.FiAward} mr={1}/>
                            Certified
                          </react_2.Badge>
                        </react_2.Tooltip>)}
                    </react_2.HStack>
                  </react_2.VStack>
                </react_2.CardHeader>
                
                <react_2.CardBody pt={0}>
                  <react_2.VStack spacing={4} align="stretch">
                    {/* Score */}
                    <react_2.Box>
                      <react_2.HStack justify="space-between" mb={2}>
                        <react_2.Text fontSize="sm" fontWeight="medium">Score</react_2.Text>
                        <react_2.Text fontSize="sm" color={`${getScoreColor(lesson.score)}.500`} fontWeight="bold">
                          {lesson.score}%
                        </react_2.Text>
                      </react_2.HStack>
                      <react_2.Progress value={lesson.score} colorScheme={getScoreColor(lesson.score)} size="sm" borderRadius="full"/>
                    </react_2.Box>
                    
                    {/* Stats */}
                    <react_2.SimpleGrid columns={2} spacing={4} fontSize="sm">
                      <react_2.VStack spacing={1}>
                        <react_2.Icon as={fi_1.FiClock} color="gray.500"/>
                        <react_2.Text fontWeight="medium">{formatTime(lesson.time_spent)}</react_2.Text>
                        <react_2.Text color="gray.500" fontSize="xs">Time spent</react_2.Text>
                      </react_2.VStack>
                      
                      <react_2.VStack spacing={1}>
                        <react_2.Icon as={fi_1.FiCalendar} color="gray.500"/>
                        <react_2.Text fontWeight="medium">{formatDate(lesson.completed_at)}</react_2.Text>
                        <react_2.Text color="gray.500" fontSize="xs">Completed</react_2.Text>
                      </react_2.VStack>
                    </react_2.SimpleGrid>
                    
                    {/* Tags */}
                    {lesson.tags.length > 0 && (<react_2.HStack spacing={1} wrap="wrap">
                        {lesson.tags.slice(0, 3).map((tag, index) => (<react_2.Badge key={index} size="sm" colorScheme="gray" variant="subtle">
                            {tag}
                          </react_2.Badge>))}
                        {lesson.tags.length > 3 && (<react_2.Badge size="sm" colorScheme="gray" variant="subtle">
                            +{lesson.tags.length - 3}
                          </react_2.Badge>)}
                      </react_2.HStack>)}
                  </react_2.VStack>
                </react_2.CardBody>
              </react_2.Card>))}
          </react_2.SimpleGrid>) : (<react_2.Card bg={cardBg} borderRadius="xl" boxShadow="lg">
            <react_2.CardBody py={16} textAlign="center">
              <react_2.VStack spacing={6}>
                <react_2.Icon as={fi_1.FiBook} boxSize={16} color="gray.400"/>
                <react_2.VStack spacing={2}>
                  <react_2.Heading size="lg" color="gray.600">
                    {searchTerm || subjectFilter || difficultyFilter
                ? 'No matching lessons found'
                : 'No completed lessons yet'}
                  </react_2.Heading>
                  <react_2.Text color="gray.500" maxW="md">
                    {searchTerm || subjectFilter || difficultyFilter
                ? 'Try adjusting your search criteria or filters.'
                : 'Start learning to see your completed lessons here!'}
                  </react_2.Text>
                </react_2.VStack>
                <react_2.Button leftIcon={<fi_1.FiBook />} colorScheme="brand" onClick={() => navigate('/lessons')}>
                  Browse Lessons
                </react_2.Button>
              </react_2.VStack>
            </react_2.CardBody>
          </react_2.Card>)}
      </react_2.VStack>
    </react_2.Container>);
};
exports.default = Completed;
//# sourceMappingURL=Completed.js.map