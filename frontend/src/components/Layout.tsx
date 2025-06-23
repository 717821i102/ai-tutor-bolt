import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  IconButton,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Show,
  Hide
} from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBook, FiMessageCircle, FiUser, FiSettings, FiBarChart, FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Lessons', href: '/lessons', icon: FiBook },
    { name: 'Q&A', href: '/qa', icon: FiMessageCircle },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart },
    { name: 'Profile', href: '/profile', icon: FiUser },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavItems = () => (
    <VStack spacing={1} align="stretch">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Button
            key={item.name}
            as={Link}
            to={item.href}
            variant={isActive ? 'solid' : 'ghost'}
            colorScheme={isActive ? 'primary' : 'gray'}
            justifyContent="flex-start"
            leftIcon={<Icon />}
            onClick={onClose}
          >
            {item.name}
          </Button>
        );
      })}
    </VStack>
  );

  return (
    <Flex h="100vh">
      {/* Desktop Sidebar */}
      <Hide below="md">
        <Box
          w="250px"
          bg={bg}
          borderRight="1px"
          borderColor={borderColor}
          p={4}
        >
          <VStack spacing={6} align="stretch" h="full">
            <Text fontSize="xl" fontWeight="bold" color="primary.500">
              AI Tutor Pro
            </Text>
            <NavItems />
          </VStack>
        </Box>
      </Hide>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>AI Tutor Pro</DrawerHeader>
          <DrawerBody>
            <NavItems />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Flex direction="column" flex={1}>
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px={4}
          py={3}
          bg={bg}
          borderBottom="1px"
          borderColor={borderColor}
        >
          <HStack>
            <Show below="md">
              <IconButton
                aria-label="Open menu"
                icon={<FiMenu />}
                variant="ghost"
                onClick={onOpen}
              />
            </Show>
            <Text fontSize="lg" fontWeight="semibold">
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </Text>
          </HStack>

          <HStack spacing={3}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              variant="ghost"
              onClick={toggleColorMode}
            />
            
            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  name={user?.displayName}
                  src={user?.avatarUrl}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => navigate('/settings')}>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Page Content */}
        <Box flex={1} overflow="auto" p={6}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;