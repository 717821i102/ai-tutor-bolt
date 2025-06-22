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
const fi_1 = require("react-icons/fi");
const QuestionInput = ({ onSubmit, isLoading, hasLessonContext = false, }) => {
    const [question, setQuestion] = (0, react_1.useState)('');
    const [context, setContext] = (0, react_1.useState)('');
    const { isOpen, onToggle } = (0, react_2.useDisclosure)();
    const textareaBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const handleSubmit = () => {
        if (question.trim()) {
            onSubmit(question, context.trim() || undefined);
            setQuestion('');
            // Keep context for potential follow-up questions
        }
    };
    const handleKeyDown = (e) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };
    return (<react_2.Box>
      <react_2.FormControl>
        <react_2.Textarea placeholder={`Ask a question${hasLessonContext ? ' about this lesson' : ''}...`} value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={handleKeyDown} size="md" rows={2} resize="none" bg={textareaBg} disabled={isLoading}/>
      </react_2.FormControl>
      
      <react_2.HStack mt={2} justify="space-between">
        <react_2.IconButton aria-label="Add context" icon={isOpen ? <fi_1.FiChevronUp /> : <fi_1.FiChevronDown />} size="sm" variant="ghost" onClick={onToggle}/>
        
        <react_2.Button colorScheme="brand" rightIcon={<fi_1.FiSend />} isLoading={isLoading} loadingText="Sending..." onClick={handleSubmit} isDisabled={!question.trim() || isLoading}>
          {isLoading ? 'Thinking...' : 'Ask'}
        </react_2.Button>
      </react_2.HStack>
      
      <react_2.Collapse in={isOpen} animateOpacity>
        <react_2.Box mt={2}>
          <react_2.FormControl>
            <react_2.FormLabel fontSize="sm">
              Additional Context (optional)
            </react_2.FormLabel>
            <react_2.Textarea placeholder="Add any additional context for your question..." value={context} onChange={(e) => setContext(e.target.value)} size="sm" rows={3} resize="vertical" bg={textareaBg} disabled={isLoading}/>
          </react_2.FormControl>
        </react_2.Box>
      </react_2.Collapse>
    </react_2.Box>);
};
exports.default = QuestionInput;
//# sourceMappingURL=QuestionInput.js.map