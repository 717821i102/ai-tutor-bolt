"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const fi_1 = require("react-icons/fi");
const EmptyState = ({ icon = fi_1.FiInbox, title, description, actionLabel, onAction, }) => {
    const iconColor = (0, react_2.useColorModeValue)('gray.400', 'gray.500');
    const titleColor = (0, react_2.useColorModeValue)('gray.800', 'gray.200');
    const descriptionColor = (0, react_2.useColorModeValue)('gray.600', 'gray.400');
    return (<react_2.Box textAlign="center" py={16} px={8}>
      <react_2.VStack spacing={6}>
        <react_2.Icon as={icon} boxSize={16} color={iconColor}/>
        
        <react_2.VStack spacing={2}>
          <react_2.Text fontSize="xl" fontWeight="bold" color={titleColor}>
            {title}
          </react_2.Text>
          
          <react_2.Text fontSize="md" color={descriptionColor} maxW="md" lineHeight="tall">
            {description}
          </react_2.Text>
        </react_2.VStack>
        
        {actionLabel && onAction && (<react_2.Button colorScheme="brand" onClick={onAction} size="lg">
            {actionLabel}
          </react_2.Button>)}
      </react_2.VStack>
    </react_2.Box>);
};
exports.default = EmptyState;
//# sourceMappingURL=EmptyState.js.map