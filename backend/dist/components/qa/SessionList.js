"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const fi_1 = require("react-icons/fi");
const SessionList = ({ sessions, activeSessionId, onSessionSelect, onSessionEdit, onSessionDelete, isLoading = false, }) => {
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const hoverBg = (0, react_2.useColorModeValue)('gray.50', 'gray.600');
    const activeBg = (0, react_2.useColorModeValue)('brand.50', 'brand.900');
    const activeColor = (0, react_2.useColorModeValue)('brand.600', 'brand.300');
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
            if (diffInHours < 24) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            else if (diffInHours < 168) { // 7 days
                return date.toLocaleDateString([], { weekday: 'short' });
            }
            else {
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }
        }
        catch {
            return '';
        }
    };
    const truncateTitle = (title, maxLength = 40) => {
        if (title.length <= maxLength)
            return title;
        return title.substring(0, maxLength) + '...';
    };
    if (sessions.length === 0) {
        return (<react_2.Box textAlign="center" py={8} color="gray.500">
        <react_2.Icon as={fi_1.FiMessageCircle} boxSize={8} mb={3}/>
        <react_2.Text fontWeight="medium">No conversations yet</react_2.Text>
        <react_2.Text fontSize="sm" mt={1}>
          Start a new conversation to begin
        </react_2.Text>
      </react_2.Box>);
    }
    return (<react_2.VStack spacing={2} align="stretch">
      {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (<react_2.Box key={session.id} p={3} borderRadius="lg" bg={isActive ? activeBg : cardBg} borderWidth="1px" borderColor={isActive ? 'brand.200' : 'transparent'} cursor="pointer" transition="all 0.2s" _hover={{
                    bg: isActive ? activeBg : hoverBg,
                    transform: 'translateY(-1px)',
                    boxShadow: 'sm'
                }} onClick={() => onSessionSelect(session)} position="relative">
            <react_2.HStack justify="space-between" align="start">
              <react_2.VStack align="start" spacing={1} flex={1} minW={0}>
                <react_2.Text fontWeight={isActive ? "600" : "medium"} color={isActive ? activeColor : undefined} fontSize="sm" noOfLines={2} lineHeight="short">
                  {truncateTitle(session.title)}
                </react_2.Text>
                
                {session.topic && (<react_2.Text fontSize="xs" color="gray.500" noOfLines={1}>
                    {session.topic}
                  </react_2.Text>)}
                
                <react_2.HStack spacing={3} fontSize="xs" color="gray.500">
                  <react_2.HStack spacing={1}>
                    <react_2.Icon as={fi_1.FiMessageCircle}/>
                    <react_2.Text>{session.message_count}</react_2.Text>
                  </react_2.HStack>
                  
                  <react_2.HStack spacing={1}>
                    <react_2.Icon as={fi_1.FiClock}/>
                    <react_2.Text>{formatDate(session.updated_at)}</react_2.Text>
                  </react_2.HStack>
                  
                  {session.lesson_id && (<react_2.Tooltip label="Lesson context" hasArrow>
                      <react_2.HStack spacing={1}>
                        <react_2.Icon as={fi_1.FiBook} color="blue.500"/>
                      </react_2.HStack>
                    </react_2.Tooltip>)}
                </react_2.HStack>
              </react_2.VStack>
              
              <react_2.Menu>
                <react_2.MenuButton as={react_2.IconButton} icon={<fi_1.FiMoreVertical />} size="xs" variant="ghost" onClick={(e) => e.stopPropagation()} opacity={0.7} _hover={{ opacity: 1 }}/>
                <react_2.MenuList>
                  <react_2.MenuItem icon={<fi_1.FiEdit />} onClick={(e) => {
                    e.stopPropagation();
                    onSessionEdit(session);
                }}>
                    Edit Title
                  </react_2.MenuItem>
                  <react_2.MenuItem icon={<fi_1.FiTrash2 />} color="red.500" onClick={(e) => {
                    e.stopPropagation();
                    onSessionDelete(session.id);
                }}>
                    Delete
                  </react_2.MenuItem>
                </react_2.MenuList>
              </react_2.Menu>
            </react_2.HStack>
            
            {session.is_active && (<react_2.Badge position="absolute" top={2} right={2} colorScheme="green" variant="solid" size="sm">
                Active
              </react_2.Badge>)}
          </react_2.Box>);
        })}
    </react_2.VStack>);
};
exports.default = SessionList;
//# sourceMappingURL=SessionList.js.map