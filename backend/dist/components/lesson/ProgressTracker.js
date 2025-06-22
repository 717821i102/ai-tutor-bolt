"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const ProgressTracker = ({ totalSections, currentSection, onSectionClick, }) => {
    const isMobile = (0, react_2.useBreakpointValue)({ base: true, md: false });
    const activeBg = (0, react_2.useColorModeValue)('brand.500', 'brand.400');
    const activeColor = (0, react_2.useColorModeValue)('white', 'white');
    const inactiveBg = (0, react_2.useColorModeValue)('gray.100', 'gray.700');
    const inactiveColor = (0, react_2.useColorModeValue)('gray.600', 'gray.300');
    // For mobile, we'll show a simplified view
    if (isMobile) {
        return (<react_2.Text textAlign="center" fontWeight="medium">
        {currentSection} of {totalSections}
      </react_2.Text>);
    }
    // For desktop, show section buttons
    // Limit the number of visible buttons to avoid overflow
    const maxVisibleButtons = 5;
    let buttons = [];
    if (totalSections <= maxVisibleButtons) {
        // Show all buttons if total sections are less than max visible
        buttons = Array.from({ length: totalSections }, (_, i) => (<react_2.Button key={i} size="sm" variant="solid" bg={i + 1 === currentSection ? activeBg : inactiveBg} color={i + 1 === currentSection ? activeColor : inactiveColor} _hover={{ bg: i + 1 === currentSection ? 'brand.600' : 'gray.200' }} onClick={() => onSectionClick(i + 1)}>
        {i + 1}
      </react_2.Button>));
    }
    else {
        // Show a subset of buttons with ellipsis
        const visibleButtons = [];
        // Always show first button
        visibleButtons.push(<react_2.Button key={0} size="sm" variant="solid" bg={1 === currentSection ? activeBg : inactiveBg} color={1 === currentSection ? activeColor : inactiveColor} _hover={{ bg: 1 === currentSection ? 'brand.600' : 'gray.200' }} onClick={() => onSectionClick(1)}>
        1
      </react_2.Button>);
        // Calculate which buttons to show around current
        let start = Math.max(2, currentSection - 1);
        let end = Math.min(totalSections - 1, currentSection + 1);
        // Adjust start and end to show at most 3 buttons in the middle
        if (end - start > 1) {
            start = Math.max(2, end - 2);
        }
        // Add ellipsis before middle buttons if needed
        if (start > 2) {
            visibleButtons.push(<react_2.Text key="ellipsis1" px={2}>
          ...
        </react_2.Text>);
        }
        // Add middle buttons
        for (let i = start; i <= end; i++) {
            visibleButtons.push(<react_2.Button key={i} size="sm" variant="solid" bg={i === currentSection ? activeBg : inactiveBg} color={i === currentSection ? activeColor : inactiveColor} _hover={{ bg: i === currentSection ? 'brand.600' : 'gray.200' }} onClick={() => onSectionClick(i)}>
          {i}
        </react_2.Button>);
        }
        // Add ellipsis after middle buttons if needed
        if (end < totalSections - 1) {
            visibleButtons.push(<react_2.Text key="ellipsis2" px={2}>
          ...
        </react_2.Text>);
        }
        // Always show last button
        visibleButtons.push(<react_2.Button key={totalSections} size="sm" variant="solid" bg={totalSections === currentSection ? activeBg : inactiveBg} color={totalSections === currentSection ? activeColor : inactiveColor} _hover={{ bg: totalSections === currentSection ? 'brand.600' : 'gray.200' }} onClick={() => onSectionClick(totalSections)}>
        {totalSections}
      </react_2.Button>);
        buttons = visibleButtons;
    }
    return <react_2.HStack spacing={1}>{buttons}</react_2.HStack>;
};
exports.default = ProgressTracker;
//# sourceMappingURL=ProgressTracker.js.map