import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Progress,
  Card,
  CardBody,
  Badge,
  Divider,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiUser, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

interface Lesson {
  _id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  durationMinutes: number;
  summary: string;
  content: Array<{
    title: string;
    content: string;
    order: number;
    type: string;
  }>;
  exercises: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  tags: string[];
  createdBy: {
    displayName: string;
  };
}

const LessonView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);

  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (id) {
      fetchLesson();
    }
  }, [id]);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lessons/${id}`);
      setLesson(response.data);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (lesson && currentSection < lesson.content.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      setProgress(((newSection + 1) / lesson.content.length) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      const newSection = currentSection - 1;
      setCurrentSection(newSection);
      setProgress(((newSection + 1) / lesson.content.length) * 100);
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  if (error || !lesson) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error || 'Lesson not found'}
      </Alert>
    );
  }

  const currentContent = lesson.content[currentSection];

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/lessons')}
        >
          Back to Lessons
        </Button>
      </HStack>

      {/* Lesson Info */}
      <Card bg={cardBg}>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between" wrap="wrap">
              <VStack align="start" spacing={2}>
                <Heading size="lg">{lesson.title}</Heading>
                <Text color="primary.500" fontWeight="medium">
                  {lesson.subject} • {lesson.topic}
                </Text>
              </VStack>
              <Badge colorScheme="blue" fontSize="sm">
                {lesson.difficulty}
              </Badge>
            </HStack>

            <Text color="gray.600">{lesson.summary}</Text>

            <HStack spacing={6} fontSize="sm" color="gray.500">
              <HStack>
                <FiClock />
                <Text>{lesson.durationMinutes} minutes</Text>
              </HStack>
              <HStack>
                <FiUser />
                <Text>{lesson.createdBy?.displayName || 'Anonymous'}</Text>
              </HStack>
            </HStack>

            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">Progress</Text>
                <Text fontSize="sm" color="gray.500">
                  {currentSection + 1} of {lesson.content.length}
                </Text>
              </HStack>
              <Progress value={progress} colorScheme="primary" size="sm" />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Content */}
      <Card bg={cardBg}>
        <CardBody>
          <VStack align="stretch" spacing={6}>
            <Heading size="md">{currentContent?.title}</Heading>
            <Divider />
            <Box>
              <Text whiteSpace="pre-wrap" lineHeight="tall">
                {currentContent?.content}
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Navigation */}
      <HStack justify="space-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          isDisabled={currentSection === 0}
        >
          Previous
        </Button>
        
        <Text fontSize="sm" color="gray.500">
          Section {currentSection + 1} of {lesson.content.length}
        </Text>
        
        <Button
          colorScheme="primary"
          onClick={handleNext}
          isDisabled={currentSection === lesson.content.length - 1}
        >
          {currentSection === lesson.content.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </HStack>
    </VStack>
  );
};

export default LessonView;