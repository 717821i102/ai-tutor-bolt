"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const icons_1 = require("@chakra-ui/icons");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../../contexts/AuthContext");
const Navbar = () => {
    const { isOpen, onToggle } = (0, react_2.useDisclosure)();
    const { colorMode, toggleColorMode } = (0, react_2.useColorMode)();
    const { currentUser, logout } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Move all hooks to the top
    const bg = (0, react_2.useColorModeValue)('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
    const borderColor = (0, react_2.useColorModeValue)('gray.200', 'gray.700');
    const textColor = (0, react_2.useColorModeValue)('gray.600', 'white');
    const hoverBg = (0, react_2.useColorModeValue)('gray.100', 'gray.700');
    // Choose logo based on color mode
    const logoSrc = colorMode === 'dark' ? '/aitutor-short-dark.png' : '/aitutor-short-no-bg.png';
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Error logging out:', error);
        }
    };
    return (<react_2.Box>
      <react_2.Flex bg={bg} color={textColor} minH={'72px'} py={{ base: 2 }} px={{ base: 4, md: 8 }} borderBottom={1} borderStyle={'solid'} borderColor={borderColor} align={'center'} position="fixed" top="0" width="100%" zIndex="sticky" backdropFilter="blur(20px)" boxShadow="gradient-sm">
        <react_2.Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
          <react_2.IconButton onClick={onToggle} icon={isOpen ? <icons_1.CloseIcon w={3} h={3}/> : <icons_1.HamburgerIcon w={5} h={5}/>} variant={'ghost'} aria-label={'Toggle Navigation'} _hover={{ bg: hoverBg }}/>
        </react_2.Flex>
        
        <react_2.Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
          <react_2.HStack spacing={3}>
            <react_2.Image src={logoSrc} alt="AI Tutor Logo" w="40px" h="40px" borderRadius="lg" transition="all 0.3s ease" _hover={{ transform: 'scale(1.05)' }}/>
            <react_2.Text textAlign={(0, react_2.useBreakpointValue)({ base: 'center', md: 'left' })} fontFamily={'heading'} bgGradient="linear(135deg, #A855F7 0%, #3B82F6 100%)" bgClip="text" fontWeight="bold" fontSize="xl" as={react_router_dom_1.Link} to="/" _hover={{ textDecoration: 'none', transform: 'scale(1.02)' }} transition="all 0.3s ease">
              AI Tutor
            </react_2.Text>
          </react_2.HStack>
        </react_2.Flex>

        {/* Right side - only user actions, no navigation menu */}
        <react_2.HStack spacing={4} justify="flex-end">
          {/* Notifications */}
          <react_2.Tooltip label="Notifications" hasArrow>
            <react_2.IconButton aria-label="Notifications" icon={<icons_1.BellIcon />} variant="ghost" size="sm" position="relative" _hover={{ bg: hoverBg }} borderRadius="xl">
              <react_2.Badge colorScheme="red" variant="solid" borderRadius="full" position="absolute" top="-1" right="-1" fontSize="xs" minW="18px" h="18px" display="flex" alignItems="center" justifyContent="center" bgGradient="linear(135deg, #EF4444 0%, #DC2626 100%)">
                3
              </react_2.Badge>
            </react_2.IconButton>
          </react_2.Tooltip>

          {/* Color mode toggle */}
          <react_2.Tooltip label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`} hasArrow>
            <react_2.IconButton aria-label="Toggle color mode" onClick={toggleColorMode} icon={colorMode === 'light' ? <icons_1.MoonIcon /> : <icons_1.SunIcon />} variant="ghost" size="sm" _hover={{ bg: hoverBg }} borderRadius="xl"/>
          </react_2.Tooltip>
          
          {currentUser && (<react_2.Menu>
              <react_2.MenuButton as={react_2.Button} rightIcon={<icons_1.ChevronDownIcon />} variant="ghost" size="sm" _hover={{ bg: hoverBg }} borderRadius="xl">
                <react_2.HStack spacing={2}>
                  <react_2.Avatar size="sm" name={currentUser.displayName || undefined} src={currentUser.photoURL || undefined} border="2px solid" borderColor="brand.200"/>
                  <react_2.Text display={{ base: 'none', lg: 'block' }} fontSize="sm" fontWeight="medium">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </react_2.Text>
                </react_2.HStack>
              </react_2.MenuButton>
              <react_2.MenuList borderRadius="xl" border="1px solid" borderColor={borderColor} boxShadow="gradient-md">
                <react_2.MenuItem as={react_router_dom_1.Link} to="/profile" borderRadius="lg" _hover={{ bg: hoverBg }}>
                  Profile Settings
                </react_2.MenuItem>
                <react_2.MenuItem as={react_router_dom_1.Link} to="/analytics" borderRadius="lg" _hover={{ bg: hoverBg }}>
                  Learning Analytics
                </react_2.MenuItem>
                <react_2.MenuItem borderRadius="lg" _hover={{ bg: hoverBg }}>
                  Help & Support
                </react_2.MenuItem>
                <react_2.MenuItem onClick={handleLogout} color="red.500" borderRadius="lg" _hover={{ bg: 'red.50' }}>
                  Sign Out
                </react_2.MenuItem>
              </react_2.MenuList>
            </react_2.Menu>)}
        </react_2.HStack>
      </react_2.Flex>

      <react_2.Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </react_2.Collapse>
      
      {/* Space to prevent content from hiding behind fixed navbar */}
      <react_2.Box height="72px"/>
    </react_2.Box>);
};
const MobileNav = () => {
    // Move hooks to the top
    const bg = (0, react_2.useColorModeValue)('white', 'gray.800');
    const borderColor = (0, react_2.useColorModeValue)('gray.200', 'gray.700');
    return (<react_2.Box bg={bg} p={4} display={{ md: 'none' }} borderBottom={1} borderColor={borderColor}>
      <react_2.Text fontSize="sm" color="gray.500" textAlign="center">
        Use the sidebar for navigation on larger screens
      </react_2.Text>
    </react_2.Box>);
};
exports.default = Navbar;
//# sourceMappingURL=Navbar.js.map