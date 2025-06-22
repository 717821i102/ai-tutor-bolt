"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const fi_1 = require("react-icons/fi");
const QAHistoryItem = ({ item, onClick }) => {
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const hoverBg = (0, react_2.useColorModeValue)('gray.50', 'gray.600');
    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        catch {
            return '';
        }
    };
    // Truncate text
    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength)
            return text;
        return text.substring(0, maxLength) + '...';
    };
    return (<react_2.Box p={3} borderRadius="md" borderWidth="1px" bg={cardBg} cursor="pointer" _hover={{ bg: hoverBg }} onClick={onClick} transition="all 0.2s">
      <react_2.Text fontWeight="medium" mb={1}>
        {truncateText(item.question, 80)}
      </react_2.Text>
      
      <react_2.Flex justify="space-between" align="center" mt={2}>
        <react_2.Flex align="center" fontSize="xs" color="gray.500">
          <react_2.Icon as={fi_1.FiClock} mr={1}/>
          <react_2.Text>{formatDate(item.created_at)}</react_2.Text>
        </react_2.Flex>
        
        {item.lesson_id && (<react_2.Badge colorScheme="blue" size="sm">
            <react_2.Flex align="center">
              <react_2.Icon as={fi_1.FiBook} mr={1}/>
              <react_2.Text>Lesson</react_2.Text>
            </react_2.Flex>
          </react_2.Badge>)}
      </react_2.Flex>
    </react_2.Box>);
};
exports.default = QAHistoryItem;
//# sourceMappingURL=QAHistoryItem.js.map