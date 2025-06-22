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
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("@chakra-ui/react");
const fi_1 = require("react-icons/fi");
const api_1 = __importDefault(require("../services/api"));
// Import components
const QuestionInput_1 = __importDefault(require("../components/qa/QuestionInput"));
const AnswerDisplay_1 = __importDefault(require("../components/qa/AnswerDisplay"));
const SessionList_1 = __importDefault(require("../components/qa/SessionList"));
const SessionHeader_1 = __importDefault(require("../components/qa/SessionHeader"));
const QAInterface = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const toast = (0, react_2.useToast)();
    const messagesEndRef = (0, react_1.useRef)(null);
    const { isOpen: isHistoryOpen, onToggle: toggleHistory } = (0, react_2.useDisclosure)();
    const { isOpen: isNewSessionOpen, onOpen: openNewSession, onClose: closeNewSession } = (0, react_2.useDisclosure)();
    const cardBg = (0, react_2.useColorModeValue)('white', 'gray.700');
    const isMobile = (0, react_2.useBreakpointValue)({ base: true, lg: false });
    // State
    const [sessions, setSessions] = (0, react_1.useState)([]);
    const [activeSession, setActiveSession] = (0, react_1.useState)(null);
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isLoadingSessions, setIsLoadingSessions] = (0, react_1.useState)(true);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const [selectedLessonId, setSelectedLessonId] = (0, react_1.useState)(null);
    // New session form
    const [newSessionTitle, setNewSessionTitle] = (0, react_1.useState)('');
    const [newSessionTopic, setNewSessionTopic] = (0, react_1.useState)('');
    // Extract lesson ID from query params if present
    (0, react_1.useEffect)(() => {
        const params = new URLSearchParams(location.search);
        const lessonId = params.get('lessonId');
        if (lessonId) {
            setSelectedLessonId(lessonId);
        }
    }, [location]);
    // Fetch sessions
    const fetchSessions = (0, react_1.useCallback)(async () => {
        setIsLoadingSessions(true);
        setHasError(false);
        try {
            const response = await api_1.default.get('/qa/sessions');
            const sessionsData = response.data.sessions || [];
            setSessions(sessionsData);
            // Auto-select the most recent session if none is selected
            if (!activeSession && sessionsData.length > 0) {
                const mostRecent = sessionsData[0];
                setActiveSession(mostRecent);
                setMessages(mostRecent.messages || []);
            }
        }
        catch (err) {
            console.error('Failed to fetch sessions:', err);
            setHasError(true);
            setSessions([]);
        }
        finally {
            setIsLoadingSessions(false);
        }
    }, [activeSession]);
    // Fetch sessions on mount
    (0, react_1.useEffect)(() => {
        fetchSessions();
    }, [fetchSessions]);
    // Scroll to bottom when messages change
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    // Generate session title from first question
    const generateSessionTitle = (question) => {
        const words = question.split(' ').slice(0, 6);
        return words.join(' ') + (question.split(' ').length > 6 ? '...' : '');
    };
    // Auto-generate topic from question content
    const generateTopic = (question) => {
        const mathKeywords = ['equation', 'algebra', 'calculus', 'geometry', 'math', 'formula'];
        const physicsKeywords = ['physics', 'force', 'energy', 'motion', 'quantum', 'mechanics'];
        const programmingKeywords = ['code', 'programming', 'function', 'algorithm', 'javascript', 'python'];
        const chemistryKeywords = ['chemistry', 'molecule', 'reaction', 'element', 'compound'];
        const lowerQuestion = question.toLowerCase();
        if (mathKeywords.some(keyword => lowerQuestion.includes(keyword)))
            return 'Mathematics';
        if (physicsKeywords.some(keyword => lowerQuestion.includes(keyword)))
            return 'Physics';
        if (programmingKeywords.some(keyword => lowerQuestion.includes(keyword)))
            return 'Programming';
        if (chemistryKeywords.some(keyword => lowerQuestion.includes(keyword)))
            return 'Chemistry';
        return 'General';
    };
    // Create new session
    const createSession = async (title, topic) => {
        try {
            const sessionData = {
                title: title || 'New Conversation',
                topic: topic,
                lesson_id: selectedLessonId || undefined,
            };
            const response = await api_1.default.post('/qa/sessions', sessionData);
            const newSession = response.data;
            // Add to sessions list
            setSessions(prev => [newSession, ...prev]);
            return newSession;
        }
        catch (error) {
            console.error('Error creating session:', error);
            throw new Error('Failed to create conversation. Please check your connection and try again.');
        }
    };
    // Handle question submission
    const handleQuestionSubmit = async (question, context) => {
        setIsLoading(true);
        try {
            let currentSession = activeSession;
            // Create new session if none exists
            if (!currentSession) {
                const title = generateSessionTitle(question);
                const topic = generateTopic(question);
                currentSession = await createSession(title, topic);
                setActiveSession(currentSession);
            }
            // Send question to API
            const requestData = {
                question,
                context,
                session_id: currentSession.id,
                lesson_id: selectedLessonId || undefined,
            };
            const response = await api_1.default.post('/qa/ask', requestData);
            const newMessage = response.data;
            // Add message to current messages
            setMessages(prev => [...prev, newMessage]);
            // Update session in list
            setSessions(prev => prev.map(session => session.id === currentSession.id
                ? {
                    ...session,
                    message_count: session.message_count + 1,
                    updated_at: new Date().toISOString(),
                    messages: [...(session.messages || []), newMessage]
                }
                : session));
        }
        catch (err) {
            console.error('Error submitting question:', err);
            toast({
                title: 'Failed to send question',
                description: err.message || 'Please check your connection and try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    // Handle session selection
    const handleSessionSelect = (session) => {
        setActiveSession(session);
        setMessages(session.messages || []);
        if (isMobile) {
            toggleHistory();
        }
    };
    // Handle session update
    const handleSessionUpdate = async (sessionId, updates) => {
        try {
            await api_1.default.put(`/qa/sessions/${sessionId}`, updates);
            setSessions(prev => prev.map(session => session.id === sessionId
                ? { ...session, ...updates, updated_at: new Date().toISOString() }
                : session));
            if (activeSession?.id === sessionId) {
                setActiveSession(prev => prev ? { ...prev, ...updates } : null);
            }
        }
        catch (error) {
            console.error('Error updating session:', error);
            toast({
                title: 'Failed to update session',
                description: 'Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };
    // Handle session deletion
    const handleSessionDelete = async (sessionId) => {
        try {
            await api_1.default.delete(`/qa/sessions/${sessionId}`);
            setSessions(prev => prev.filter(session => session.id !== sessionId));
            if (activeSession?.id === sessionId) {
                const remainingSessions = sessions.filter(s => s.id !== sessionId);
                if (remainingSessions.length > 0) {
                    handleSessionSelect(remainingSessions[0]);
                }
                else {
                    setActiveSession(null);
                    setMessages([]);
                }
            }
            toast({
                title: 'Conversation deleted',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }
        catch (error) {
            toast({
                title: 'Failed to delete conversation',
                description: 'Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };
    // Handle new session creation
    const handleNewSession = async () => {
        try {
            const title = newSessionTitle.trim() || 'New Conversation';
            const topic = newSessionTopic.trim() || undefined;
            const newSession = await createSession(title, topic);
            setActiveSession(newSession);
            setMessages([]);
            setNewSessionTitle('');
            setNewSessionTopic('');
            closeNewSession();
            toast({
                title: 'New conversation started',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Error in handleNewSession:', error);
            toast({
                title: 'Failed to create conversation',
                description: error.message || 'Please check your connection and try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    // Show connection error
    if (hasError) {
        return (<react_2.Container maxW="container.xl" py={8}>
        <react_2.Alert status="error" borderRadius="lg" mb={6}>
          <react_2.AlertIcon />
          <react_2.AlertTitle mr={2}>Connection Error</react_2.AlertTitle>
          <react_2.AlertDescription>
            Unable to connect to the AI Tutor service. Please check your internet connection and try again.
          </react_2.AlertDescription>
        </react_2.Alert>
        
        <react_2.VStack spacing={8} textAlign="center">
          <react_2.Icon as={fi_1.FiWifi} boxSize={16} color="red.400"/>
          <react_2.VStack spacing={4}>
            <react_2.Heading size="lg" color="red.500">Service Unavailable</react_2.Heading>
            <react_2.Text color="gray.600" maxW="md">
              The AI Tutor service is currently unavailable. Please ensure you have an active internet connection and the service is running.
            </react_2.Text>
          </react_2.VStack>
          <react_2.Button leftIcon={<fi_1.FiRefreshCw />} onClick={fetchSessions} colorScheme="brand" size="lg">
            Try Again
          </react_2.Button>
        </react_2.VStack>
      </react_2.Container>);
    }
    return (<react_2.Container maxW="container.xl" py={6}>
      <react_2.VStack spacing={6} align="stretch">
        {/* Header */}
        <react_2.Box>
          <react_2.Heading as="h1" size="xl" mb={2}>
            AI Tutor Conversations
          </react_2.Heading>
          <react_2.Text color="gray.600">
            Have natural conversations with your AI tutor. Each session keeps context for better learning.
          </react_2.Text>
        </react_2.Box>

        <react_2.Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          {/* Main conversation area */}
          <react_2.Box flex={3}>
            <react_2.Card boxShadow="lg" borderRadius="xl">
              <react_2.CardHeader>
                {activeSession ? (<SessionHeader_1.default session={activeSession} onSessionUpdate={handleSessionUpdate}/>) : (<react_2.HStack justify="space-between">
                    <react_2.HStack>
                      <fi_1.FiMessageSquare />
                      <react_2.Text fontWeight="bold" fontSize="lg">
                        Select a conversation or start a new one
                      </react_2.Text>
                    </react_2.HStack>
                    <react_2.Button leftIcon={<fi_1.FiPlus />} colorScheme="brand" size="sm" onClick={openNewSession}>
                      New Chat
                    </react_2.Button>
                  </react_2.HStack>)}
                
                {/* Mobile controls */}
                <react_2.HStack mt={3} display={{ base: 'flex', lg: 'none' }}>
                  <react_2.Button leftIcon={<fi_1.FiSidebar />} size="sm" variant="outline" onClick={toggleHistory}>
                    Conversations
                  </react_2.Button>
                  <react_2.Button leftIcon={<fi_1.FiPlus />} colorScheme="brand" size="sm" onClick={openNewSession}>
                    New
                  </react_2.Button>
                </react_2.HStack>
              </react_2.CardHeader>
              
              <react_2.CardBody>
                <react_2.Flex direction="column" height="60vh">
                  {/* Messages area */}
                  <react_2.VStack spacing={6} align="stretch" overflowY="auto" flex={1} px={2} pb={4}>
                    {!activeSession ? (<react_2.Flex height="100%" direction="column" justify="center" align="center" color="gray.500" textAlign="center">
                        <fi_1.FiMessageSquare size={48}/>
                        <react_2.Text mt={4} fontSize="lg" fontWeight="medium">
                          Welcome to AI Tutor Conversations
                        </react_2.Text>
                        <react_2.Text fontSize="sm" mt={2} maxW="md">
                          Start a new conversation or select an existing one to continue learning with context-aware discussions.
                        </react_2.Text>
                        <react_2.Button mt={4} leftIcon={<fi_1.FiPlus />} colorScheme="brand" onClick={openNewSession}>
                          Start New Conversation
                        </react_2.Button>
                      </react_2.Flex>) : messages.length === 0 ? (<react_2.Flex height="100%" direction="column" justify="center" align="center" color="gray.500" textAlign="center">
                        <fi_1.FiMessageSquare size={48}/>
                        <react_2.Text mt={4} fontSize="lg" fontWeight="medium">
                          Start the conversation
                        </react_2.Text>
                        <react_2.Text fontSize="sm" mt={2} maxW="md">
                          Ask your first question to begin this learning session.
                        </react_2.Text>
                      </react_2.Flex>) : (messages.map((message, index) => (<AnswerDisplay_1.default key={message.id || index} question={message.question} answer={message.answer} references={message.references} timestamp={message.created_at}/>)))}
                    
                    {/* Loading indicator */}
                    {isLoading && (<react_2.Box p={6} borderRadius="lg" bg={cardBg}>
                        <react_2.VStack spacing={3}>
                          <react_2.Skeleton height="20px" width="80%"/>
                          <react_2.Skeleton height="20px" width="60%"/>
                          <react_2.Skeleton height="20px" width="70%"/>
                        </react_2.VStack>
                      </react_2.Box>)}
                    
                    <div ref={messagesEndRef}/>
                  </react_2.VStack>
                  
                  {/* Question input */}
                  <react_2.Box pt={6} borderTop="1px" borderColor="gray.200">
                    <QuestionInput_1.default onSubmit={handleQuestionSubmit} isLoading={isLoading} hasLessonContext={!!selectedLessonId}/>
                  </react_2.Box>
                </react_2.Flex>
              </react_2.CardBody>
            </react_2.Card>
          </react_2.Box>
          
          {/* Sessions sidebar - Desktop */}
          <react_2.Box flex={1} minWidth={{ lg: '320px' }} display={{ base: 'none', lg: 'block' }}>
            <react_2.Card boxShadow="lg" borderRadius="xl">
              <react_2.CardHeader>
                <react_2.HStack justify="space-between">
                  <react_2.HStack>
                    <fi_1.FiClock />
                    <react_2.Heading as="h2" size="md">Conversations</react_2.Heading>
                  </react_2.HStack>
                  <react_2.Button leftIcon={<fi_1.FiPlus />} size="sm" colorScheme="brand" onClick={openNewSession}>
                    New
                  </react_2.Button>
                </react_2.HStack>
              </react_2.CardHeader>
              
              <react_2.CardBody pt={0}>
                <react_2.Box height="60vh" overflowY="auto">
                  {isLoadingSessions ? (<react_2.VStack spacing={3} align="stretch">
                      {Array(5).fill(0).map((_, i) => (<react_2.Skeleton key={i} height="80px" borderRadius="lg"/>))}
                    </react_2.VStack>) : (<SessionList_1.default sessions={sessions} activeSessionId={activeSession?.id} onSessionSelect={handleSessionSelect} onSessionEdit={(session) => {
                // Edit functionality handled by SessionHeader
            }} onSessionDelete={handleSessionDelete}/>)}
                </react_2.Box>
              </react_2.CardBody>
            </react_2.Card>
          </react_2.Box>
        </react_2.Flex>

        {/* Mobile sessions collapse */}
        <react_2.Box display={{ base: 'block', lg: 'none' }}>
          {isHistoryOpen && (<react_2.Card boxShadow="lg" borderRadius="xl">
              <react_2.CardHeader>
                <react_2.HStack justify="space-between">
                  <react_2.HStack>
                    <fi_1.FiClock />
                    <react_2.Heading as="h2" size="md">Conversations</react_2.Heading>
                  </react_2.HStack>
                  <react_2.IconButton aria-label="Close conversations" icon={<react_2.Icon as={fi_1.FiPlus}/>} size="sm" variant="ghost" onClick={toggleHistory}/>
                </react_2.HStack>
              </react_2.CardHeader>
              
              <react_2.CardBody pt={0}>
                <react_2.Box maxHeight="50vh" overflowY="auto">
                  <SessionList_1.default sessions={sessions} activeSessionId={activeSession?.id} onSessionSelect={handleSessionSelect} onSessionEdit={(session) => {
                // Edit functionality handled by SessionHeader
            }} onSessionDelete={handleSessionDelete}/>
                </react_2.Box>
              </react_2.CardBody>
            </react_2.Card>)}
        </react_2.Box>
      </react_2.VStack>

      {/* New Session Modal */}
      <react_2.Modal isOpen={isNewSessionOpen} onClose={closeNewSession} size="md">
        <react_2.ModalOverlay />
        <react_2.ModalContent>
          <react_2.ModalHeader>Start New Conversation</react_2.ModalHeader>
          <react_2.ModalCloseButton />
          <react_2.ModalBody>
            <react_2.VStack spacing={4} align="stretch">
              <react_2.FormControl>
                <react_2.FormLabel>Title (optional)</react_2.FormLabel>
                <react_2.Input value={newSessionTitle} onChange={(e) => setNewSessionTitle(e.target.value)} placeholder="Enter conversation title or leave blank for auto-generation" size="lg"/>
              </react_2.FormControl>
              
              <react_2.FormControl>
                <react_2.FormLabel>Topic (optional)</react_2.FormLabel>
                <react_2.Input value={newSessionTopic} onChange={(e) => setNewSessionTopic(e.target.value)} placeholder="e.g., Mathematics, Physics, Programming" size="lg"/>
              </react_2.FormControl>
              
              <react_2.Text fontSize="sm" color="gray.600">
                If you leave the title blank, it will be automatically generated from your first question.
              </react_2.Text>
            </react_2.VStack>
          </react_2.ModalBody>
          <react_2.ModalFooter>
            <react_2.Button variant="ghost" mr={3} onClick={closeNewSession}>
              Cancel
            </react_2.Button>
            <react_2.Button colorScheme="brand" onClick={handleNewSession}>
              Start Conversation
            </react_2.Button>
          </react_2.ModalFooter>
        </react_2.ModalContent>
      </react_2.Modal>
    </react_2.Container>);
};
exports.default = QAInterface;
//# sourceMappingURL=QAInterface.js.map