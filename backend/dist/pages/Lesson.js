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
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("@chakra-ui/react");
const icons_1 = require("@chakra-ui/icons");
const fi_1 = require("react-icons/fi");
const api_1 = __importDefault(require("../services/api"));
// Import components
const LessonSection_1 = __importDefault(require("../components/lesson/LessonSection"));
const ExerciseComponent_1 = __importDefault(require("../components/lesson/ExerciseComponent"));
const ProgressTracker_1 = __importDefault(require("../components/lesson/ProgressTracker"));
const Lesson = () => {
    const { lessonId } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const toast = (0, react_2.useToast)();
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const contentBg = (0, react_2.useColorModeValue)('gray.50', 'gray.800');
    // State
    const [lesson, setLesson] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [currentSectionIndex, setCurrentSectionIndex] = (0, react_1.useState)(0);
    const [lessonProgress, setLessonProgress] = (0, react_1.useState)({
        progress: 0,
        time_spent: 0,
        completed: false,
    });
    const [startTime, setStartTime] = (0, react_1.useState)(Date.now());
    const [exerciseAnswers, setExerciseAnswers] = (0, react_1.useState)({});
    const [exerciseScore, setExerciseScore] = (0, react_1.useState)(null);
    // Save progress function
    const saveProgress = (0, react_1.useCallback)(async (isAutoSave = false) => {
        if (!lessonId || !lesson)
            return;
        try {
            const timeSpent = lessonProgress.time_spent + Math.floor((Date.now() - startTime) / 1000);
            const progressPercentage = lesson.content.length > 0
                ? (currentSectionIndex + 1) / lesson.content.length
                : 0;
            const progressData = {
                progress: progressPercentage,
                time_spent: timeSpent,
                completed: lessonProgress.completed,
                last_position: currentSectionIndex.toString(),
                score: exerciseScore === null ? undefined : exerciseScore,
            };
            await api_1.default.post(`/lessons/${lessonId}/progress`, progressData);
            setStartTime(Date.now());
            setLessonProgress(progressData);
            if (!isAutoSave) {
                toast({
                    title: 'Progress saved',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
        catch (err) {
            console.error('Error saving progress:', err);
            if (!isAutoSave) {
                toast({
                    title: 'Failed to save progress',
                    description: err.response?.data?.detail || 'Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    }, [lessonId, lesson, lessonProgress, currentSectionIndex, exerciseScore, startTime, toast]);
    // Fetch lesson data
    (0, react_1.useEffect)(() => {
        const fetchLesson = async () => {
            if (!lessonId)
                return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await api_1.default.get(`/lessons/${lessonId}`);
                setLesson(response.data);
                const progressResponse = await api_1.default.get(`/users/me/progress?lesson_id=${lessonId}`);
                if (progressResponse.data && progressResponse.data.completed_lessons) {
                    const existingProgress = progressResponse.data.completed_lessons.find((item) => item.lesson_id === lessonId);
                    if (existingProgress) {
                        setLessonProgress({
                            progress: existingProgress.progress || 0,
                            time_spent: existingProgress.time_spent || 0,
                            completed: existingProgress.completed || false,
                            score: existingProgress.score,
                            last_position: existingProgress.last_position,
                        });
                        if (existingProgress.last_position) {
                            const sectionIndex = parseInt(existingProgress.last_position);
                            if (!isNaN(sectionIndex)) {
                                setCurrentSectionIndex(sectionIndex);
                            }
                        }
                    }
                }
            }
            catch (err) {
                console.error('Error fetching lesson:', err);
                setError(err.response?.data?.detail || 'Failed to load lesson. Please try again.');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchLesson();
        const timer = setInterval(() => {
            setLessonProgress(prev => ({
                ...prev,
                time_spent: prev.time_spent + 5,
            }));
        }, 5000);
        return () => {
            clearInterval(timer);
            saveProgress(true);
        };
    }, [lessonId, saveProgress]);
    // Mark lesson as complete
    const completeLesson = async () => {
        if (!lessonId || !lesson)
            return;
        try {
            let finalScore = exerciseScore;
            if (!finalScore && Object.keys(exerciseAnswers).length > 0) {
                let correctAnswers = 0;
                lesson.exercises.forEach((exercise, index) => {
                    if (exerciseAnswers[index] === exercise.correct_answer) {
                        correctAnswers++;
                    }
                });
                finalScore = lesson.exercises.length > 0
                    ? (correctAnswers / lesson.exercises.length) * 100
                    : null;
                setExerciseScore(finalScore);
            }
            const timeSpent = lessonProgress.time_spent + Math.floor((Date.now() - startTime) / 1000);
            const progressData = {
                progress: 1.0,
                time_spent: timeSpent,
                completed: true,
                score: finalScore === null ? undefined : finalScore,
                last_position: currentSectionIndex.toString(),
            };
            await api_1.default.post(`/lessons/${lessonId}/progress`, progressData);
            setLessonProgress(progressData);
            toast({
                title: 'Lesson completed!',
                description: 'Your progress has been saved.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
        catch (err) {
            console.error('Error completing lesson:', err);
            toast({
                title: 'Failed to complete lesson',
                description: err.response?.data?.detail || 'Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    const handleAnswerSelect = (exerciseIndex, answer) => {
        setExerciseAnswers(prev => ({
            ...prev,
            [exerciseIndex]: answer,
        }));
    };
    const navigateToSection = (index) => {
        if (index >= 0 && index < (lesson?.content.length || 0)) {
            setCurrentSectionIndex(index);
            saveProgress();
        }
    };
    const calculateProgress = () => {
        if (!lesson || lesson.content.length === 0)
            return 0;
        return ((currentSectionIndex + 1) / lesson.content.length) * 100;
    };
    if (isLoading) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.VStack spacing={6} align="stretch">
          <react_2.Skeleton height="40px" width="70%"/>
          <react_2.Skeleton height="20px" width="40%"/>
          <react_2.Skeleton height="400px"/>
          <react_2.HStack spacing={4}>
            <react_2.Skeleton height="40px" width="100px"/>
            <react_2.Skeleton height="40px" width="100px"/>
          </react_2.HStack>
        </react_2.VStack>
      </react_2.Container>);
    }
    if (error || !lesson) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.Alert status="error" borderRadius="md">
          <react_2.AlertIcon />
          <react_2.AlertTitle mr={2}>Error!</react_2.AlertTitle>
          <react_2.AlertDescription>{error || 'Failed to load lesson'}</react_2.AlertDescription>
        </react_2.Alert>
        <react_2.Button mt={4} onClick={() => navigate('/lessons')}>
          Back to Lessons
        </react_2.Button>
      </react_2.Container>);
    }
    const currentSection = lesson.content[currentSectionIndex];
    const isLastSection = currentSectionIndex === lesson.content.length - 1;
    const isFirstSection = currentSectionIndex === 0;
    return (<react_2.Container maxW="container.xl" py={6}>
      {/* Breadcrumbs */}
      <react_2.Breadcrumb mb={6} fontSize="sm">
        <react_2.BreadcrumbItem>
          <react_2.BreadcrumbLink onClick={() => navigate('/')}>Home</react_2.BreadcrumbLink>
        </react_2.BreadcrumbItem>
        <react_2.BreadcrumbItem>
          <react_2.BreadcrumbLink onClick={() => navigate('/lessons')}>Lessons</react_2.BreadcrumbLink>
        </react_2.BreadcrumbItem>
        <react_2.BreadcrumbItem isCurrentPage>
          <react_2.BreadcrumbLink>{lesson.title}</react_2.BreadcrumbLink>
        </react_2.BreadcrumbItem>
      </react_2.Breadcrumb>
      
      {/* Lesson header - Enhanced */}
      <react_2.Card bg={cardBg} mb={8} boxShadow="lg" borderRadius="xl">
        <react_2.CardHeader pb={4}>
          <react_2.VStack align="stretch" spacing={4}>
            <react_2.Heading as="h1" size="2xl" color="brand.600" lineHeight="shorter">
              {lesson.title}
            </react_2.Heading>
            
            <react_2.HStack spacing={4} flexWrap="wrap">
              <react_2.Tag colorScheme="blue" size="lg" px={4} py={2}>
                {lesson.subject}
              </react_2.Tag>
              <react_2.Tag colorScheme="purple" size="lg" px={4} py={2}>
                {lesson.difficulty}
              </react_2.Tag>
              <react_2.Flex align="center" bg={contentBg} px={4} py={2} borderRadius="full">
                <react_2.Icon as={fi_1.FiClock} mr={2} color="gray.500"/>
                <react_2.Text fontSize="sm" fontWeight="medium">{lesson.duration_minutes} minutes</react_2.Text>
              </react_2.Flex>
            </react_2.HStack>
            
            {lesson.summary && (<react_2.Box p={4} bg={contentBg} borderRadius="lg" borderLeft="4px solid" borderLeftColor="brand.500">
                <react_2.Text fontSize="lg" fontStyle="italic" color="gray.700" lineHeight="tall">
                  {lesson.summary}
                </react_2.Text>
              </react_2.Box>)}
            
            {/* Enhanced Progress bar */}
            <react_2.Box>
              <react_2.Flex justify="space-between" mb={2}>
                <react_2.Text fontSize="sm" fontWeight="medium">
                  Progress: {Math.round(calculateProgress())}%
                </react_2.Text>
                <react_2.Text fontSize="sm" color="gray.500">
                  Section {currentSectionIndex + 1} of {lesson.content.length}
                </react_2.Text>
              </react_2.Flex>
              <react_2.Progress value={calculateProgress()} size="lg" colorScheme="brand" hasStripe isAnimated borderRadius="full" bg="gray.100"/>
            </react_2.Box>
          </react_2.VStack>
        </react_2.CardHeader>
      </react_2.Card>
      
      {/* Navigation controls - top */}
      <react_2.Flex justify="space-between" mb={6} align="center">
        <react_2.Button leftIcon={<icons_1.ChevronLeftIcon />} onClick={() => navigateToSection(currentSectionIndex - 1)} isDisabled={isFirstSection} variant="outline" size="lg">
          Previous
        </react_2.Button>
        
        <ProgressTracker_1.default totalSections={lesson.content.length} currentSection={currentSectionIndex + 1} onSectionClick={(index) => navigateToSection(index - 1)}/>
        
        <react_2.Button rightIcon={<icons_1.ChevronRightIcon />} onClick={() => navigateToSection(currentSectionIndex + 1)} isDisabled={isLastSection} colorScheme="brand" size="lg">
          Next
        </react_2.Button>
      </react_2.Flex>
      
      {/* Current section content - Enhanced */}
      <react_2.Card bg={cardBg} mb={8} boxShadow="lg" borderRadius="xl">
        <react_2.CardBody p={8}>
          <LessonSection_1.default title={currentSection.title} content={currentSection.content} type={currentSection.type} mediaUrl={currentSection.media_url}/>
        </react_2.CardBody>
      </react_2.Card>
      
      {/* Exercises - Enhanced */}
      {isLastSection && lesson.exercises.length > 0 && (<react_2.Card bg={cardBg} mb={8} boxShadow="lg" borderRadius="xl">
          <react_2.CardHeader>
            <react_2.Heading as="h2" size="xl" color="brand.600" display="flex" alignItems="center">
              <react_2.Icon as={fi_1.FiFileText} mr={3}/>
              Practice Exercises
            </react_2.Heading>
            <react_2.Text color="gray.600" mt={2}>
              Test your understanding with these exercises
            </react_2.Text>
          </react_2.CardHeader>
          <react_2.CardBody pt={0}>
            <react_2.VStack spacing={8} align="stretch">
              {lesson.exercises.map((exercise, index) => (<ExerciseComponent_1.default key={index} exercise={exercise} index={index} selectedAnswer={exerciseAnswers[index]} onAnswerSelect={(answer) => handleAnswerSelect(index, answer)}/>))}
            </react_2.VStack>
          </react_2.CardBody>
        </react_2.Card>)}
      
      {/* Resources - Enhanced */}
      {lesson.resources.length > 0 && (<react_2.Card bg={cardBg} mb={8} boxShadow="lg" borderRadius="xl">
          <react_2.CardHeader>
            <react_2.Heading as="h2" size="xl" color="brand.600" display="flex" alignItems="center">
              <react_2.Icon as={fi_1.FiExternalLink} mr={3}/>
              Additional Resources
            </react_2.Heading>
            <react_2.Text color="gray.600" mt={2}>
              Explore these resources to deepen your understanding
            </react_2.Text>
          </react_2.CardHeader>
          <react_2.CardBody pt={0}>
            <react_2.SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {lesson.resources.map((resource, index) => (<react_2.Box key={index} p={6} borderWidth={2} borderRadius="xl" borderColor="gray.200" bg={contentBg} transition="all 0.2s" _hover={{
                    borderColor: 'brand.300',
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                }}>
                  <react_2.VStack align="stretch" spacing={4}>
                    <react_2.Heading as="h3" size="md" color="brand.600">
                      {resource.title}
                    </react_2.Heading>
                    {resource.description && (<react_2.Text fontSize="sm" color="gray.600" lineHeight="tall">
                        {resource.description}
                      </react_2.Text>)}
                    <react_2.Link href={resource.url} isExternal color="brand.500" fontWeight="semibold" display="flex" alignItems="center" _hover={{ color: 'brand.600' }}>
                      <react_2.Icon as={fi_1.FiExternalLink} mr={2}/>
                      Open Resource
                    </react_2.Link>
                  </react_2.VStack>
                </react_2.Box>))}
            </react_2.SimpleGrid>
          </react_2.CardBody>
        </react_2.Card>)}
      
      {/* Navigation controls - bottom */}
      <react_2.Flex justify="space-between" mt={8}>
        <react_2.Button leftIcon={<icons_1.ChevronLeftIcon />} onClick={() => navigateToSection(currentSectionIndex - 1)} isDisabled={isFirstSection} variant="outline" size="lg">
          Previous
        </react_2.Button>
        
        <react_2.HStack spacing={4}>
          <react_2.Button onClick={() => saveProgress()} colorScheme="gray" size="lg">
            Save Progress
          </react_2.Button>
          {isLastSection && (<react_2.Button onClick={completeLesson} colorScheme="green" size="lg">
              Complete Lesson
            </react_2.Button>)}
        </react_2.HStack>
        
        <react_2.Button rightIcon={<icons_1.ChevronRightIcon />} onClick={() => navigateToSection(currentSectionIndex + 1)} isDisabled={isLastSection} colorScheme="brand" size="lg">
          Next
        </react_2.Button>
      </react_2.Flex>
    </react_2.Container>);
};
exports.default = Lesson;
//# sourceMappingURL=Lesson.js.map