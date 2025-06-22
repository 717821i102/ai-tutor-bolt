"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const LoadingSpinner = ({ size = 'lg', text = 'Loading...', fullScreen = false, }) => {
    // Move all hooks to the top
    const bg = (0, react_2.useColorModeValue)('white', 'gray.800');
    const emptyColor = (0, react_2.useColorModeValue)('gray.200', 'gray.600');
    const textColor = (0, react_2.useColorModeValue)('gray.600', 'gray.400');
    const content = (<react_2.VStack spacing={4}>
      <react_2.Spinner thickness="4px" speed="0.65s" emptyColor={emptyColor} color="brand.500" size={size}/>
      {text && (<react_2.Text fontSize="sm" color={textColor} fontWeight="medium">
          {text}
        </react_2.Text>)}
    </react_2.VStack>);
    if (fullScreen) {
        return (<react_2.Box position="fixed" top="0" left="0" right="0" bottom="0" bg={bg} display="flex" alignItems="center" justifyContent="center" zIndex="overlay">
        {content}
      </react_2.Box>);
    }
    return (<react_2.Box display="flex" alignItems="center" justifyContent="center" py={8}>
      {content}
    </react_2.Box>);
};
exports.default = LoadingSpinner;
//# sourceMappingURL=LoadingSpinner.js.map