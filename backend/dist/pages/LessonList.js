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
const fi_1 = require("react-icons/fi");
const react_hook_form_1 = require("react-hook-form");
const api_1 = __importDefault(require("../services/api"));
const EmptyState_1 = __importDefault(require("../components/common/EmptyState"));
// Import components
const LessonCard_1 = __importDefault(require("../components/lesson/LessonCard"));
const LessonList = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const toast = (0, react_2.useToast)();
    const { isOpen, onOpen, onClose } = (0, react_2.useDisclosure)();
    // Move all hooks to the top
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.800');
    const headingColor = (0, react_2.useColorModeValue)('gray.600', 'gray.400');
    const borderColor = (0, react_2.useColorModeValue)('gray.200', 'gray.600');
    // State
    const [lessons, setLessons] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [subjectFilter, setSubjectFilter] = (0, react_1.useState)('');
    const [difficultyFilter, setDifficultyFilter] = (0, react_1.useState)('');
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    // Form handling for lesson generation
    const { handleSubmit, register, formState: { errors }, reset, } = (0, react_hook_form_1.useForm)();
    // Fetch lessons function
    const fetchLessons = (0, react_1.useCallback)(async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            // Build query params
            let queryParams = '?limit=50';
            if (subjectFilter)
                queryParams += `&subject=${encodeURIComponent(subjectFilter)}`;
            if (difficultyFilter)
                queryParams += `&difficulty=${encodeURIComponent(difficultyFilter)}`;
            const response = await api_1.default.get(`/lessons${queryParams}`);
            setLessons(response.data.lessons || []);
        }
        catch (err) {
            console.error('Failed to fetch lessons:', err);
            setHasError(true);
            setLessons([]);
        }
        finally {
            setIsLoading(false);
        }
    }, [subjectFilter, difficultyFilter]);
    // Fetch lessons
    (0, react_1.useEffect)(() => {
        fetchLessons();
    }, [fetchLessons]);
    // Generate a new lesson
    const generateLesson = async (data) => {
        setIsGenerating(true);
        try {
            const response = await api_1.default.post('/lessons/generate', data);
            toast({
                title: 'Lesson generated!',
                description: 'Your new lesson is ready.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Navigate to the new lesson
            navigate(`/lessons/${response.data.id}`);
            onClose();
            reset();
        }
        catch (err) {
            console.error('Error generating lesson:', err);
            toast({
                title: 'Failed to generate lesson',
                description: err.response?.data?.detail || 'Please check your connection and try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsGenerating(false);
        }
    };
    // Filter lessons by search term
    const filteredLessons = lessons.filter(lesson => lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lesson.summary && lesson.summary.toLowerCase().includes(searchTerm.toLowerCase())));
    // Extract unique subjects for filter dropdown
    const subjects = Array.from(new Set(lessons.map(lesson => lesson.subject)));
    // Show connection error
    if (hasError) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.Alert status="error" borderRadius="lg" mb={6}>
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
            <react_2.Text color="gray.600" maxW="md">
              The lesson service is currently unavailable. Please ensure you have an active internet connection and the service is running.
            </react_2.Text>
          </react_2.VStack>
          <react_2.Button leftIcon={<fi_1.FiRefreshCw />} onClick={fetchLessons} colorScheme="brand" size="lg">
            Try Again
          </react_2.Button>
        </react_2.VStack>
      </react_2.Container>);
    }
    return (<react_2.Container maxW="container.xl" py={8}>
      {/* Header */}
      <react_2.Flex justify="space-between" align="center" mb={8}>
        <react_2.VStack align="start" spacing={2}>
          <react_2.Heading as="h1" size="xl">
            Lessons
          </react_2.Heading>
          <react_2.Text color={headingColor}>
            Discover and create AI-powered learning experiences
          </react_2.Text>
        </react_2.VStack>
        <react_2.Button colorScheme="brand" leftIcon={<fi_1.FiPlus />} onClick={onOpen} size="lg">
          Generate Lesson
        </react_2.Button>
      </react_2.Flex>
      
      {/* Filters */}
      <react_2.Card bg={cardBg} mb={8} boxShadow="sm">
        <react_2.CardBody>
          <react_2.VStack spacing={6}>
            <react_2.HStack w="full" align="end" spacing={4}>
              <react_2.FormControl flex={2}>
                <react_2.FormLabel fontSize="sm" fontWeight="medium">Search Lessons</react_2.FormLabel>
                <react_2.InputGroup>
                  <react_2.InputLeftElement pointerEvents="none">
                    <react_2.Icon as={fi_1.FiSearch} color="gray.400"/>
                  </react_2.InputLeftElement>
                  <react_2.Input placeholder="Search by title, topic, or subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="lg"/>
                </react_2.InputGroup>
              </react_2.FormControl>
              
              <react_2.FormControl flex={1}>
                <react_2.FormLabel fontSize="sm" fontWeight="medium">Subject</react_2.FormLabel>
                <react_2.Select placeholder="All Subjects" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} size="lg">
                  {subjects.map(subject => (<option key={subject} value={subject}>{subject}</option>))}
                </react_2.Select>
              </react_2.FormControl>
              
              <react_2.FormControl flex={1}>
                <react_2.FormLabel fontSize="sm" fontWeight="medium">Difficulty</react_2.FormLabel>
                <react_2.Select placeholder="All Difficulties" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} size="lg">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </react_2.Select>
              </react_2.FormControl>
            </react_2.HStack>
            
            {/* Filter summary */}
            {(searchTerm || subjectFilter || difficultyFilter) && (<react_2.HStack w="full" justify="space-between" pt={4} borderTop="1px solid" borderColor={borderColor}>
                <react_2.Text fontSize="sm" color={headingColor}>
                  {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''} found
                </react_2.Text>
                <react_2.Button size="sm" variant="ghost" onClick={() => {
                setSearchTerm('');
                setSubjectFilter('');
                setDifficultyFilter('');
            }}>
                  Clear Filters
                </react_2.Button>
              </react_2.HStack>)}
          </react_2.VStack>
        </react_2.CardBody>
      </react_2.Card>
      
      {/* Lessons grid */}
      {isLoading ? (<react_2.SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {Array(6).fill(0).map((_, index) => (<react_2.Card key={index} bg={cardBg}>
              <react_2.CardBody>
                <react_2.VStack align="stretch" spacing={4}>
                  <react_2.Skeleton height="24px" width="80%"/>
                  <react_2.HStack>
                    <react_2.Skeleton height="20px" width="60px"/>
                    <react_2.Skeleton height="20px" width="80px"/>
                  </react_2.HStack>
                  <react_2.Skeleton height="16px" width="100%"/>
                  <react_2.Skeleton height="16px" width="70%"/>
                  <react_2.HStack justify="space-between">
                    <react_2.Skeleton height="16px" width="50px"/>
                    <react_2.Skeleton height="16px" width="80px"/>
                  </react_2.HStack>
                </react_2.VStack>
              </react_2.CardBody>
            </react_2.Card>))}
        </react_2.SimpleGrid>) : filteredLessons.length > 0 ? (<react_2.SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredLessons.map(lesson => (<LessonCard_1.default key={lesson.id} lesson={lesson} onClick={() => navigate(`/lessons/${lesson.id}`)}/>))}
        </react_2.SimpleGrid>) : lessons.length === 0 ? (
        // No lessons at all
        <EmptyState_1.default icon={fi_1.FiBook} title="No lessons available" description="Get started by creating your first AI-generated lesson tailored to your learning needs." actionLabel="Generate Your First Lesson" onAction={onOpen}/>) : (
        // Lessons exist but filtered results are empty
        <EmptyState_1.default icon={fi_1.FiSearch} title="No lessons match your search" description="Try adjusting your search criteria or create a new lesson with the topic you're looking for." actionLabel="Generate New Lesson" onAction={onOpen}/>)}
      
      {/* Generate Lesson Modal */}
      <react_2.Modal isOpen={isOpen} onClose={onClose} size="lg">
        <react_2.ModalOverlay />
        <react_2.ModalContent>
          <react_2.ModalHeader>Generate New Lesson</react_2.ModalHeader>
          <react_2.ModalCloseButton />
          <react_2.ModalBody>
            <form id="generate-lesson-form" onSubmit={handleSubmit(generateLesson)}>
              <react_2.VStack spacing={6} align="stretch">
                <react_2.FormControl isInvalid={!!errors.subject}>
                  <react_2.FormLabel>Subject</react_2.FormLabel>
                  <react_2.Input placeholder="e.g., Mathematics, Physics, Computer Science" size="lg" {...register('subject', {
        required: 'Subject is required',
        minLength: { value: 2, message: 'Subject must be at least 2 characters' }
    })}/>
                  <react_2.FormErrorMessage>{errors.subject?.message}</react_2.FormErrorMessage>
                </react_2.FormControl>
                
                <react_2.FormControl isInvalid={!!errors.topic}>
                  <react_2.FormLabel>Topic</react_2.FormLabel>
                  <react_2.Input placeholder="e.g., Linear Algebra, Quantum Mechanics, Web Development" size="lg" {...register('topic', {
        required: 'Topic is required',
        minLength: { value: 2, message: 'Topic must be at least 2 characters' }
    })}/>
                  <react_2.FormErrorMessage>{errors.topic?.message}</react_2.FormErrorMessage>
                </react_2.FormControl>
                
                <react_2.FormControl isInvalid={!!errors.difficulty}>
                  <react_2.FormLabel>Difficulty</react_2.FormLabel>
                  <react_2.Select placeholder="Select difficulty" size="lg" {...register('difficulty', {
        required: 'Difficulty is required'
    })}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </react_2.Select>
                  <react_2.FormErrorMessage>{errors.difficulty?.message}</react_2.FormErrorMessage>
                </react_2.FormControl>
                
                <react_2.FormControl isInvalid={!!errors.duration_minutes}>
                  <react_2.FormLabel>Duration (minutes)</react_2.FormLabel>
                  <react_2.Input type="number" placeholder="e.g., 30" size="lg" {...register('duration_minutes', {
        required: 'Duration is required',
        min: { value: 5, message: 'Duration must be at least 5 minutes' },
        max: { value: 120, message: 'Duration must be at most 120 minutes' }
    })}/>
                  <react_2.FormErrorMessage>{errors.duration_minutes?.message}</react_2.FormErrorMessage>
                </react_2.FormControl>
                
                <react_2.FormControl>
                  <react_2.FormLabel>Additional Instructions (Optional)</react_2.FormLabel>
                  <react_2.Input placeholder="Any specific requirements or focus areas" size="lg" {...register('additional_instructions')}/>
                </react_2.FormControl>
              </react_2.VStack>
            </form>
          </react_2.ModalBody>
          <react_2.ModalFooter>
            <react_2.Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </react_2.Button>
            <react_2.Button form="generate-lesson-form" type="submit" colorScheme="brand" isLoading={isGenerating} loadingText="Generating...">
              Generate
            </react_2.Button>
          </react_2.ModalFooter>
        </react_2.ModalContent>
      </react_2.Modal>
    </react_2.Container>);
};
exports.default = LessonList;
//# sourceMappingURL=LessonList.js.map