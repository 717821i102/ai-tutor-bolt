import React, { useState, useEffect } from 'react';
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

  const cardBg = useColorModeValue('white', 'gray.800');
  const userBg = useColorModeValue('primary.50', 'primary.900');
  const aiBg = useColorModeValue('gray.50', 'gray.700');

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
    }
  };

  return (
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
          )}
        </VStack>
      </Box>

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
  );
};

export default QA;