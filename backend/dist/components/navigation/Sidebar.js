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
const react_2 = require("@chakra-ui/react");
const react_router_dom_1 = require("react-router-dom");
const fi_1 = require("react-icons/fi");
const api_1 = __importDefault(require("../../services/api"));
const NavItem = ({ icon, children, to, isActive, badge, tooltip, isCollapsed }) => {
    // Call all hooks at the top level, unconditionally
    const activeBg = (0, react_2.useColorModeValue)('brand.50', 'brand.900');
    const activeColor = (0, react_2.useColorModeValue)('brand.600', 'brand.300');
    const textColor = (0, react_2.useColorModeValue)('gray.600', 'gray.300');
    const hoverBg = (0, react_2.useColorModeValue)('gray.50', 'gray.700');
    const hoverTextColor = (0, react_2.useColorModeValue)('gray.800', 'white');
    const content = (<react_2.Box as={react_router_dom_1.Link} to={to} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} w="full">
      <react_2.Flex align="center" p="3" mx="2" borderRadius="lg" role="group" cursor="pointer" bg={isActive ? activeBg : 'transparent'} color={isActive ? activeColor : textColor} fontWeight={isActive ? '600' : '500'} transition="all 0.2s" _hover={{
            bg: isActive ? activeBg : hoverBg,
            color: isActive ? activeColor : hoverTextColor,
            transform: 'translateX(2px)',
        }} position="relative" justify={isCollapsed ? 'center' : 'flex-start'}>
        {isActive && (<react_2.Box position="absolute" left="-2" top="0" bottom="0" w="1" bg="brand.500" borderRadius="full"/>)}
        
        <react_2.Icon mr={isCollapsed ? "0" : "3"} fontSize="18" as={icon} transition="all 0.2s"/>
        
        {!isCollapsed && (<>
            <react_2.Text fontSize="sm" flex="1">
              {children}
            </react_2.Text>
            
            {badge && (<react_2.Badge colorScheme={isActive ? 'brand' : 'gray'} variant="subtle" borderRadius="full" fontSize="xs" minW="20px" textAlign="center">
                {badge}
              </react_2.Badge>)}
          </>)}
      </react_2.Flex>
    </react_2.Box>);
    if (tooltip && isCollapsed) {
        return (<react_2.Tooltip label={`${children}${badge ? ` (${badge})` : ''}`} placement="right" hasArrow>
        {content}
      </react_2.Tooltip>);
    }
    if (tooltip) {
        return (<react_2.Tooltip label={tooltip} placement="right" hasArrow>
        {content}
      </react_2.Tooltip>);
    }
    return content;
};
const Sidebar = () => {
    // Call all hooks at the top level, unconditionally
    const location = (0, react_router_dom_1.useLocation)();
    const { isOpen: isCollapsed, onToggle } = (0, react_2.useDisclosure)();
    const [counts, setCounts] = (0, react_1.useState)({
        userLessons: 0,
        availableLessons: 0,
        userQuestions: 0,
        completedLessons: 0,
    });
    const [userProgress, setUserProgress] = (0, react_1.useState)(null);
    const sidebarBg = (0, react_2.useColorModeValue)('white', 'gray.800');
    const borderColor = (0, react_2.useColorModeValue)('gray.200', 'gray.700');
    const labelColor = (0, react_2.useColorModeValue)('gray.500', 'gray.400');
    const progressTextColor = (0, react_2.useColorModeValue)('brand.700', 'brand.300');
    const progressSubColor = (0, react_2.useColorModeValue)('gray.600', 'gray.400');
    const progressBarBg = (0, react_2.useColorModeValue)('brand.100', 'brand.800');
    const weeklyGoalCardBg = (0, react_2.useColorModeValue)('brand.50', 'brand.900');
    // Fetch real-time user-specific counts
    (0, react_1.useEffect)(() => {
        const fetchCounts = async () => {
            try {
                const progressResponse = await api_1.default.get('/users/me/progress');
                const progressData = progressResponse.data;
                setUserProgress(progressData);
                const completedLessons = progressData?.completed_lessons?.length || 0;
                const qaResponse = await api_1.default.get('/qa/history?limit=1');
                const userQuestions = qaResponse.data.total || 0;
                const lessonsResponse = await api_1.default.get('/lessons?limit=1');
                const availableLessons = lessonsResponse.data.total || 0;
                let userLessons = 0;
                try {
                    const userLessonsResponse = await api_1.default.get('/lessons/my-lessons?limit=1');
                    userLessons = userLessonsResponse.data.total || 0;
                }
                catch (error) {
                    console.warn('User-specific lessons endpoint not available');
                }
                setCounts({
                    userLessons,
                    availableLessons,
                    userQuestions,
                    completedLessons,
                });
            }
            catch (error) {
                console.warn('Failed to fetch sidebar counts:', error);
            }
        };
        fetchCounts();
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, []);
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };
    const weeklyProgress = userProgress?.statistics?.completed_this_week || 0;
    const weeklyGoal = userProgress?.statistics?.weekly_goal || 7;
    const progressPercentage = weeklyGoal > 0 ? (weeklyProgress / weeklyGoal) * 100 : 0;
    const sidebarWidth = isCollapsed ? '80px' : '200px';
    // Update CSS variable for MainLayout
    (0, react_1.useEffect)(() => {
        document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    }, [sidebarWidth]);
    return (<react_2.Box position="fixed" height="calc(100vh - 72px)" w={{ base: 'full', md: sidebarWidth }} display={{ base: 'none', md: 'block' }} bg={sidebarBg} borderRight="1px" borderRightColor={borderColor} pt={4} pb={4} overflowY="auto" boxShadow="sm" transition="width 0.3s ease">
      <react_2.VStack spacing={4} align="stretch" px={2}>
        {/* Collapse Toggle */}
        <react_2.Flex justify={isCollapsed ? 'center' : 'flex-end'} px={2}>
          <react_2.IconButton aria-label="Toggle sidebar" icon={<react_2.Icon as={isCollapsed ? fi_1.FiChevronRight : fi_1.FiChevronLeft}/>} size="sm" variant="ghost" onClick={onToggle}/>
        </react_2.Flex>

        {/* Main Navigation */}
        <react_2.Box>
          {!isCollapsed && (<react_2.Text fontSize="xs" fontWeight="bold" color={labelColor} textTransform="uppercase" letterSpacing="wide" mb={3} px={2}>
              Main
            </react_2.Text>)}
          <react_2.VStack spacing={1} align="stretch">
            <NavItem icon={fi_1.FiHome} to="/" isActive={isActive('/')} tooltip="Dashboard" isCollapsed={isCollapsed}>
              Dashboard
            </NavItem>
            
            <NavItem icon={fi_1.FiBook} to="/lessons" isActive={isActive('/lessons')} badge={counts.availableLessons > 0 ? counts.availableLessons : undefined} tooltip={`${counts.availableLessons} lessons available`} isCollapsed={isCollapsed}>
              Lessons
            </NavItem>
            
            <NavItem icon={fi_1.FiHelpCircle} to="/qa" isActive={isActive('/qa')} badge={counts.userQuestions > 0 ? counts.userQuestions : undefined} tooltip={`${counts.userQuestions} questions asked`} isCollapsed={isCollapsed}>
              Q&A
            </NavItem>
          </react_2.VStack>
        </react_2.Box>

        {!isCollapsed && <react_2.Divider />}

        {/* Progress */}
        <react_2.Box>
          {!isCollapsed && (<react_2.Text fontSize="xs" fontWeight="bold" color={labelColor} textTransform="uppercase" letterSpacing="wide" mb={3} px={2}>
              Progress
            </react_2.Text>)}
          <react_2.VStack spacing={1} align="stretch">
            <NavItem icon={fi_1.FiTrendingUp} to="/analytics" isActive={isActive('/analytics')} tooltip="Analytics" isCollapsed={isCollapsed}>
              Analytics
            </NavItem>
            
            <NavItem icon={fi_1.FiBookmark} to="/completed" isActive={isActive('/completed')} badge={counts.completedLessons > 0 ? counts.completedLessons : undefined} tooltip={`${counts.completedLessons} completed`} isCollapsed={isCollapsed}>
              Completed
            </NavItem>
          </react_2.VStack>
        </react_2.Box>

        {!isCollapsed && <react_2.Divider />}

        {/* Account */}
        <react_2.Box>
          {!isCollapsed && (<react_2.Text fontSize="xs" fontWeight="bold" color={labelColor} textTransform="uppercase" letterSpacing="wide" mb={3} px={2}>
              Account
            </react_2.Text>)}
          <react_2.VStack spacing={1} align="stretch">
            <NavItem icon={fi_1.FiUser} to="/profile" isActive={isActive('/profile')} tooltip="Profile" isCollapsed={isCollapsed}>
              Profile
            </NavItem>
            
            <NavItem icon={fi_1.FiSettings} to="/settings" isActive={isActive('/settings')} tooltip="Settings" isCollapsed={isCollapsed}>
              Settings
            </NavItem>
          </react_2.VStack>
        </react_2.Box>

        {/* Weekly Goal Progress - only show when expanded */}
        {!isCollapsed && userProgress && (<react_2.Box bg={weeklyGoalCardBg} p={3} borderRadius="lg" mx={2}>
            <react_2.Text fontSize="xs" fontWeight="600" mb={2} color={progressTextColor}>
              Weekly Goal
            </react_2.Text>
            <react_2.Text fontSize="xs" color={progressSubColor} mb={2}>
              {weeklyProgress}/{weeklyGoal}
            </react_2.Text>
            <react_2.Box w="full" h="2" bg={progressBarBg} borderRadius="full" overflow="hidden">
              <react_2.Box w={`${Math.min(progressPercentage, 100)}%`} h="full" bg="brand.500" borderRadius="full" transition="width 0.3s ease"/>
            </react_2.Box>
          </react_2.Box>)}
      </react_2.VStack>
    </react_2.Box>);
};
exports.default = Sidebar;
//# sourceMappingURL=Sidebar.js.map