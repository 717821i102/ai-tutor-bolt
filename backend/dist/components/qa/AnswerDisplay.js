"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const react_markdown_1 = __importDefault(require("react-markdown"));
const fi_1 = require("react-icons/fi");
const AnswerDisplay = ({ question, answer, references = [], timestamp, }) => {
    const userBg = (0, react_2.useColorModeValue)('brand.500', 'brand.600');
    const aiBg = (0, react_2.useColorModeValue)('gray.100', 'gray.700');
    const codeBlockBg = (0, react_2.useColorModeValue)('gray.100', 'gray.800');
    const colorMode = (0, react_2.useColorModeValue)('light', 'dark');
    // Format timestamp
    const formatTimestamp = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        catch {
            return '';
        }
    };
    // Create custom components for markdown rendering
    const components = {
        p: (props) => <react_2.Text my={2} lineHeight="tall" {...props}/>,
        a: (props) => <react_2.Link color="blue.500" isExternal {...props}/>,
        code: (props) => {
            const { className } = props;
            const isCodeBlock = className?.includes('language-');
            return isCodeBlock ? (<react_2.Box as="pre" p={3} my={3} borderRadius="md" bg={codeBlockBg} overflowX="auto" fontFamily="monospace" fontSize="sm" {...props}/>) : (<react_2.Box as="code" fontFamily="monospace" px={1} bg={codeBlockBg} borderRadius="sm" fontSize="sm" {...props}/>);
        },
        ul: (props) => <react_2.Box as="ul" pl={6} my={3} {...props}/>,
        ol: (props) => <react_2.Box as="ol" pl={6} my={3} {...props}/>,
        li: (props) => <react_2.Box as="li" my={1} {...props}/>,
        blockquote: (props) => (<react_2.Box as="blockquote" pl={4} my={3} borderLeftWidth="4px" borderLeftColor="gray.300" fontStyle="italic" {...props}/>),
    };
    // Choose AI avatar based on color mode
    const aiAvatarSrc = colorMode === 'dark' ? '/aitutor-short-dark.png' : '/aitutor-short-no-bg.png';
    return (<react_2.VStack spacing={4} align="stretch">
      {/* User question FIRST (bottom chronologically) - RIGHT SIDE */}
      <react_2.Flex direction="row" justify="flex-end">
        <react_2.Box bg={userBg} color="white" p={4} borderRadius="lg" borderTopRightRadius="0" maxW="80%" boxShadow="sm">
          <react_2.Text fontWeight="medium">{question}</react_2.Text>
          <react_2.HStack mt={2} fontSize="xs" color="whiteAlpha.800" justify="flex-end">
            <fi_1.FiClock />
            <react_2.Text>{formatTimestamp(timestamp)}</react_2.Text>
          </react_2.HStack>
        </react_2.Box>
        <react_2.Avatar size="sm" bg="blue.500" icon={<fi_1.FiUser fontSize="1.2rem"/>} ml={3}/>
      </react_2.Flex>
      
      {/* AI response SECOND (top chronologically) - LEFT SIDE */}
      <react_2.Flex direction="row" justify="flex-start">
        <react_2.Avatar size="sm" name="AI Tutor" bg="transparent" src={aiAvatarSrc} mr={3}/>
        <react_2.Box bg={aiBg} p={4} borderRadius="lg" borderTopLeftRadius="0" maxW="85%" boxShadow="sm">
          <react_markdown_1.default components={components}>{answer}</react_markdown_1.default>
          
          {/* References */}
          {references && references.length > 0 && (<>
              <react_2.Divider my={3}/>
              <react_2.Text fontSize="sm" fontWeight="bold" mb={2}>
                References:
              </react_2.Text>
              <react_2.VStack align="start" spacing={2}>
                {references.map((ref, index) => (<react_2.Box key={index} fontSize="sm">
                    <react_2.HStack mb={1}>
                      <react_2.Badge colorScheme="blue">{ref.source}</react_2.Badge>
                      <react_2.Text fontWeight="medium">{ref.title}</react_2.Text>
                    </react_2.HStack>
                    {ref.url && (<react_2.Link href={ref.url} color="blue.500" isExternal fontSize="xs">
                        {ref.url}
                      </react_2.Link>)}
                  </react_2.Box>))}
              </react_2.VStack>
            </>)}
          
          <react_2.HStack mt={3} fontSize="xs" color="gray.500" justify="flex-start">
            <fi_1.FiClock />
            <react_2.Text>{formatTimestamp(timestamp)}</react_2.Text>
          </react_2.HStack>
        </react_2.Box>
      </react_2.Flex>
    </react_2.VStack>);
};
exports.default = AnswerDisplay;
//# sourceMappingURL=AnswerDisplay.js.map