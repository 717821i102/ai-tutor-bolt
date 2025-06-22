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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const ExerciseComponent = ({ exercise, index, selectedAnswer, onAnswerSelect, }) => {
    const { isOpen, onToggle } = (0, react_2.useDisclosure)();
    const [showAnswer, setShowAnswer] = (0, react_1.useState)(false);
    const cardBg = (0, react_2.useColorModeValue)('gray.50', 'gray.700');
    const isCorrect = selectedAnswer === exercise.correct_answer;
    const isAnswered = !!selectedAnswer;
    // Get color scheme based on difficulty
    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'green';
            case 'medium':
                return 'blue';
            case 'hard':
                return 'purple';
            default:
                return 'gray';
        }
    };
    return (<react_2.Box p={4} borderRadius="md" borderWidth="1px" borderColor={isAnswered ? (isCorrect ? 'green.200' : 'red.200') : 'gray.200'} bg={cardBg}>
      <react_2.VStack align="stretch" spacing={4}>
        <react_2.HStack justify="space-between">
          <react_2.Text fontWeight="bold">Question {index + 1}</react_2.Text>
          <react_2.Badge colorScheme={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </react_2.Badge>
        </react_2.HStack>
        
        <react_2.Text>{exercise.question}</react_2.Text>
        
        {exercise.options && (<react_2.RadioGroup value={selectedAnswer} onChange={onAnswerSelect} isDisabled={showAnswer}>
            <react_2.Stack direction="column">
              {exercise.options.map((option, optIndex) => (<react_2.Radio key={optIndex} value={option}>
                  {option}
                </react_2.Radio>))}
            </react_2.Stack>
          </react_2.RadioGroup>)}
        
        {!exercise.options && (<react_2.Alert status="info" borderRadius="md">
            <react_2.AlertIcon />
            <react_2.AlertTitle>Free Response Question</react_2.AlertTitle>
            <react_2.Text>This is a free response question. Think about your answer before checking.</react_2.Text>
          </react_2.Alert>)}
        
        <react_2.HStack justify="space-between">
          <react_2.Button size="sm" colorScheme={showAnswer ? 'gray' : 'blue'} variant={showAnswer ? 'outline' : 'solid'} onClick={() => {
            setShowAnswer(!showAnswer);
            if (!selectedAnswer && exercise.correct_answer) {
                onAnswerSelect(exercise.correct_answer);
            }
        }}>
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </react_2.Button>
          
          {exercise.explanation && (<react_2.Button size="sm" onClick={onToggle} variant="ghost">
              {isOpen ? 'Hide Explanation' : 'Show Explanation'}
            </react_2.Button>)}
        </react_2.HStack>
        
        {showAnswer && exercise.correct_answer && (<react_2.Alert status="success" borderRadius="md">
            <react_2.AlertIcon />
            <react_2.Text fontWeight="bold">Correct Answer: {exercise.correct_answer}</react_2.Text>
          </react_2.Alert>)}
        
        <react_2.Collapse in={isOpen} animateOpacity>
          <react_2.Box p={4} bg={(0, react_2.useColorModeValue)('blue.50', 'blue.900')} borderRadius="md" mt={2}>
            <react_2.Text fontWeight="bold">Explanation:</react_2.Text>
            <react_2.Text>{exercise.explanation}</react_2.Text>
          </react_2.Box>
        </react_2.Collapse>
      </react_2.VStack>
    </react_2.Box>);
};
exports.default = ExerciseComponent;
//# sourceMappingURL=ExerciseComponent.js.map