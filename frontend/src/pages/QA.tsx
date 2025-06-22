<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  useColorModeValue,
  Spinner,
<<<<<<< HEAD
  Center,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  Divider
} from '@chakra-ui/react';
import { FiSend, FiMessageCircle, FiPlus, FiMoreVertical, FiTrash2, FiEdit } from 'react-icons/fi';
import { useQAStore } from '../stores/qaStore';

const QA: React.FC = () => {
  const {
    sessions,
    currentSession,
    loading,
    error,
    fetchSessions,
    createSession,
    fetchSession,
    askQuestion,
    deleteSession,
    setCurrentSession,
    clearError
  } = useQAStore();

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [askingQuestion, setAskingQuestion] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messagesEndRef = useRef<HTMLDivElement>(null);
=======
  Center
} from '@chakra-ui/react';
import { FiSend, FiMessageCircle } from 'react-icons/fi';

interface Message {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

const QA: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc

  const cardBg = useColorModeValue('white', 'gray.800');
  const userBg = useColorModeValue('primary.50', 'primary.900');
  const aiBg = useColorModeValue('gray.50', 'gray.700');

<<<<<<< HEAD
  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateSession = async () => {
    if (!newSessionTitle.trim()) return;

    try {
      await createSession(newSessionTitle.trim());
      setNewSessionTitle('');
      onClose();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    try {
      await fetchSession(sessionId);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim() || !currentSession) return;

    setAskingQuestion(true);
    const question = currentQuestion;
    setCurrentQuestion('');

    try {
      await askQuestion(currentSession.id, question);
    } catch (error) {
      console.error('Failed to ask question:', error);
    } finally {
      setAskingQuestion(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
=======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    setLoading(true);
    const question = currentQuestion;
    setCurrentQuestion('');

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      question,
      answer: '',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          question: '',
          answer: `This is a simulated AI response to: "${question}". In a real implementation, this would connect to your AI tutoring backend.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setLoading(false);
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
    }
  };

  return (
<<<<<<< HEAD
    <HStack spacing={6} align="stretch" h="calc(100vh - 200px)">
      {/* Sessions Sidebar */}
      <Box w="300px" flexShrink={0}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">Q&A Sessions</Heading>
            <Button
              leftIcon={<FiPlus />}
              size="sm"
              colorScheme="primary"
              onClick={onOpen}
            >
              New
            </Button>
          </HStack>

          {error && (
            <Alert status="error" size="sm">
              <AlertIcon />
              <Text fontSize="sm">{error}</Text>
            </Alert>
          )}

          <VStack spacing={2} align="stretch" maxH="400px" overflowY="auto">
            {sessions.map((session) => (
              <Card
                key={session.id}
                bg={currentSession?.id === session.id ? 'primary.50' : cardBg}
                cursor="pointer"
                onClick={() => handleSelectSession(session.id)}
                _hover={{ bg: 'gray.50' }}
              >
                <CardBody py={3}>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                        {session.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {session.messages.length} messages
                      </Text>
                    </VStack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiTrash2 />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>

          {loading && sessions.length === 0 && (
            <Center py={8}>
              <Spinner size="lg" color="primary.500" />
            </Center>
=======
    <VStack spacing={6} align="stretch" h="calc(100vh - 200px)">
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={2}>AI Tutor Q&A</Text>
        <Text color="gray.600">Ask any question and get instant help from our AI tutor</Text>
      </Box>

      {/* Messages */}
      <Box flex={1} overflowY="auto">
        <VStack spacing={4} align="stretch">
          {messages.length === 0 ? (
            <Center h="200px">
              <VStack spacing={4}>
                <FiMessageCircle size={48} color="gray.400" />
                <Text color="gray.500" textAlign="center">
                  Start a conversation with the AI tutor!<br />
                  Ask any question about your studies.
                </Text>
              </VStack>
            </Center>
          ) : (
            messages.map((message) => (
              <Box key={message.id}>
                {message.question && (
                  <Card bg={userBg} ml={8} mb={2}>
                    <CardBody py={3}>
                      <Text>{message.question}</Text>
                    </CardBody>
                  </Card>
                )}
                {message.answer && (
                  <Card bg={aiBg} mr={8}>
                    <CardBody py={3}>
                      <Text>{message.answer}</Text>
                    </CardBody>
                  </Card>
                )}
              </Box>
            ))
          )}
          {loading && (
            <Card bg={aiBg} mr={8}>
              <CardBody py={3}>
                <HStack>
                  <Spinner size="sm" />
                  <Text color="gray.500">AI is thinking...</Text>
                </HStack>
              </CardBody>
            </Card>
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
          )}
        </VStack>
      </Box>

<<<<<<< HEAD
      <Divider orientation="vertical" />

      {/* Chat Area */}
      <VStack spacing={4} align="stretch" flex={1}>
        {currentSession ? (
          <>
            <Box>
              <Heading size="md">{currentSession.title}</Heading>
              <Text fontSize="sm" color="gray.500">
                AI-powered Q&A session
              </Text>
            </Box>

            {/* Messages */}
            <Box flex={1} overflowY="auto" p={4} bg="gray.50" rounded="md">
              <VStack spacing={4} align="stretch">
                {currentSession.messages.length === 0 ? (
                  <Center h="200px">
                    <VStack spacing={4}>
                      <FiMessageCircle size={48} color="gray.400" />
                      <Text color="gray.500" textAlign="center">
                        Start the conversation!<br />
                        Ask any question to get help from the AI tutor.
                      </Text>
                    </VStack>
                  </Center>
                ) : (
                  currentSession.messages.map((message) => (
                    <VStack key={message.id} spacing={2} align="stretch">
                      {/* User Question */}
                      <HStack justify="flex-end">
                        <Card bg={userBg} maxW="70%">
                          <CardBody py={3}>
                            <Text>{message.question}</Text>
                          </CardBody>
                        </Card>
                      </HStack>

                      {/* AI Answer */}
                      <HStack justify="flex-start">
                        <Card bg={aiBg} maxW="70%">
                          <CardBody py={3}>
                            <Text whiteSpace="pre-wrap">{message.answer}</Text>
                          </CardBody>
                        </Card>
                      </HStack>
                    </VStack>
                  ))
                )}

                {askingQuestion && (
                  <HStack justify="flex-start">
                    <Card bg={aiBg} maxW="70%">
                      <CardBody py={3}>
                        <HStack>
                          <Spinner size="sm" />
                          <Text color="gray.500">AI is thinking...</Text>
                        </HStack>
                      </CardBody>
                    </Card>
                  </HStack>
                )}

                <div ref={messagesEndRef} />
              </VStack>
            </Box>

            {/* Input */}
            <Card bg={cardBg}>
              <CardBody>
                <form onSubmit={handleAskQuestion}>
                  <HStack>
                    <Input
                      placeholder="Ask a question..."
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      disabled={askingQuestion}
                    />
                    <Button
                      type="submit"
                      colorScheme="primary"
                      leftIcon={<FiSend />}
                      isLoading={askingQuestion}
                      disabled={!currentQuestion.trim()}
                    >
                      Send
                    </Button>
                  </HStack>
                </form>
              </CardBody>
            </Card>
          </>
        ) : (
          <Center flex={1}>
            <VStack spacing={4}>
              <FiMessageCircle size={64} color="gray.400" />
              <VStack spacing={2}>
                <Text fontSize="lg" color="gray.500">
                  Select a session to start chatting
                </Text>
                <Text color="gray.400" textAlign="center">
                  Choose an existing Q&A session or create a new one to get started.
                </Text>
              </VStack>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="primary"
                onClick={onOpen}
              >
                Create New Session
              </Button>
            </VStack>
          </Center>
        )}
      </VStack>

      {/* New Session Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Q&A Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Session Title</FormLabel>
              <Input
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="e.g., Math Help, Science Questions"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
              />
            </FormControl>
            <HStack mt={4} justify="flex-end">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                onClick={handleCreateSession}
                disabled={!newSessionTitle.trim()}
              >
                Create Session
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
=======
      {/* Input */}
      <Card bg={cardBg}>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <HStack>
              <Input
                placeholder="Ask a question..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                colorScheme="primary"
                leftIcon={<FiSend />}
                isLoading={loading}
                disabled={!currentQuestion.trim()}
              >
                Send
              </Button>
            </HStack>
          </form>
        </CardBody>
      </Card>
    </VStack>
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
  );
};

export default QA;