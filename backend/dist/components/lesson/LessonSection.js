"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const react_markdown_1 = __importDefault(require("react-markdown"));
const LessonSection = ({ title, content, type, mediaUrl }) => {
    const codeBlockBg = (0, react_2.useColorModeValue)('gray.50', 'gray.700');
    // Create custom components for markdown rendering
    const components = {
        h1: (props) => <react_2.Heading as="h1" size="xl" my={4} {...props}/>,
        h2: (props) => <react_2.Heading as="h2" size="lg" my={3} {...props}/>,
        h3: (props) => <react_2.Heading as="h3" size="md" my={2} {...props}/>,
        p: (props) => <react_2.Text my={2} lineHeight="tall" {...props}/>,
        code: (props) => {
            const { className } = props;
            const isCodeBlock = className?.includes('language-');
            return isCodeBlock ? (<react_2.Box as="pre" p={4} my={4} borderRadius="md" bg={codeBlockBg} overflowX="auto" fontFamily="monospace" fontSize="sm" {...props}/>) : (<react_2.Box as="code" fontFamily="monospace" px={1} bg={codeBlockBg} borderRadius="sm" fontSize="sm" {...props}/>);
        },
        ul: (props) => <react_2.Box as="ul" pl={6} my={4} {...props}/>,
        ol: (props) => <react_2.Box as="ol" pl={6} my={4} {...props}/>,
        li: (props) => <react_2.Box as="li" my={1} {...props}/>,
        blockquote: (props) => (<react_2.Box as="blockquote" pl={4} my={4} borderLeftWidth="4px" borderLeftColor="gray.300" fontStyle="italic" {...props}/>),
    };
    // Render based on section type
    const renderContent = () => {
        switch (type) {
            case 'video':
                return (<react_2.VStack spacing={4} align="stretch">
            {mediaUrl && (<react_2.AspectRatio ratio={16 / 9} mb={4}>
                <iframe title={title} src={mediaUrl} allowFullScreen frameBorder="0"/>
              </react_2.AspectRatio>)}
            <react_markdown_1.default components={components}>{content}</react_markdown_1.default>
          </react_2.VStack>);
            case 'image':
                return (<react_2.VStack spacing={4} align="stretch">
            {mediaUrl && (<react_2.Image src={mediaUrl} alt={title} borderRadius="md" maxHeight="400px" objectFit="contain" mb={4}/>)}
            <react_markdown_1.default components={components}>{content}</react_markdown_1.default>
          </react_2.VStack>);
            default: // text
                return <react_markdown_1.default components={components}>{content}</react_markdown_1.default>;
        }
    };
    return (<react_2.Box>
      <react_2.Heading as="h2" size="lg" mb={4}>{title}</react_2.Heading>
      {renderContent()}
    </react_2.Box>);
};
exports.default = LessonSection;
//# sourceMappingURL=LessonSection.js.map