"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const fi_1 = require("react-icons/fi");
const LessonCard = ({ lesson, progress, onClick }) => {
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const summaryColor = (0, react_2.useColorModeValue)('gray.600', 'gray.300');
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    // Get color scheme based on difficulty
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
    // Truncate summary if too long
    const truncateSummary = (summary, maxLength = 100) => {
        if (!summary)
            return '';
        return summary.length > maxLength
            ? `${summary.substring(0, maxLength)}...`
            : summary;
    };
    return (<react_2.Box bg={cardBg} p={5} shadow="md" borderWidth="1px" borderRadius="md" transition="all 0.2s" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} onClick={onClick} cursor="pointer" position="relative" overflow="hidden">
      {/* Progress indicator (if available) */}
      {progress && (<react_2.Box position="absolute" top={0} left={0} height="4px" width={`${progress.progress * 100}%`} bg={progress.completed ? 'green.400' : 'blue.400'}/>)}
      
      <react_2.Stack spacing={3}>
        <react_2.Heading as="h3" size="md">{lesson.title}</react_2.Heading>
        
        <react_2.HStack>
          <react_2.Badge colorScheme={getDifficultyColor(lesson.difficulty)} px={2} py={1}>
            {lesson.difficulty}
          </react_2.Badge>
          <react_2.Badge colorScheme="teal" px={2} py={1}>
            {lesson.subject}
          </react_2.Badge>
        </react_2.HStack>
        
        {lesson.summary && (<react_2.Text color={summaryColor} fontSize="sm">
            {truncateSummary(lesson.summary)}
          </react_2.Text>)}
        
        <react_2.Flex justify="space-between" align="center" fontSize="sm" color="gray.500">
          <react_2.HStack>
            <react_2.Icon as={fi_1.FiClock}/>
            <react_2.Text>{lesson.duration_minutes} min</react_2.Text>
          </react_2.HStack>
          
          <react_2.HStack>
            <react_2.Icon as={fi_1.FiCalendar}/>
            <react_2.Text>{formatDate(lesson.created_at)}</react_2.Text>
          </react_2.HStack>
        </react_2.Flex>
        
        {lesson.tags && lesson.tags.length > 0 && (<react_2.Box>
            {lesson.tags.slice(0, 3).map((tag, index) => (<react_2.Tag key={index} size="sm" colorScheme="gray" mr={2} mt={2}>
                {tag}
              </react_2.Tag>))}
            {lesson.tags.length > 3 && (<react_2.Tag size="sm" colorScheme="gray" mt={2}>
                +{lesson.tags.length - 3} more
              </react_2.Tag>)}
          </react_2.Box>)}
        
        {progress && progress.completed && (<react_2.Badge colorScheme="green" alignSelf="flex-start">
            Completed
          </react_2.Badge>)}
      </react_2.Stack>
    </react_2.Box>);
};
exports.default = LessonCard;
//# sourceMappingURL=LessonCard.js.map