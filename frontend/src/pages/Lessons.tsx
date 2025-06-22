import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  Select,
  Badge,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Spinner,
  Center,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiUser, FiEye, FiZap, FiPlus } from 'react-icons/fi';
import { useLessonStore } from '../stores/lessonStore';

const Lessons: React.FC = () => {
  const navigate = useNavigate();
  const { 
    lessons, 
    subjects, 
    loading, 
    error, 
    fetchLessons, 
    fetchSubjects, 
    clearError 
  } = useLessonStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchSubjects();
    fetchLessons();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchLessons({
        search: searchTerm,
        subject: selectedSubject,
        difficulty: selectedDifficulty
      });
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedSubject, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  if (loading && lessons.length === 0) {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" />
          <Text>Loading lessons...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" wrap="wrap">
        <Box>
          <Heading size="lg" mb={2}>Browse Lessons</Heading>
          <Text color="gray.600">Discover and learn from our comprehensive lesson library</Text>
        </Box>
        <HStack spacing={3}>
          <Button
            leftIcon={<FiZap />}
            colorScheme="primary"
            onClick={() => navigate('/lessons/generate')}
          >
            Generate with AI
          </Button>
          <Button
            leftIcon={<FiPlus />}
            variant="outline"
            onClick={() => navigate('/lessons/create')}
          >
            Create Lesson
          </Button>
        </HStack>
      </HStack>

      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
          <Button ml="auto" size="sm" onClick={clearError}>
            Dismiss
          </Button>
        </Alert>
      )}

      {/* Filters */}
      <Card bg={cardBg}>
        <CardBody>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Select
              placeholder="All subjects"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>

            <Select
              placeholder="All difficulties"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </Grid>
        </CardBody>
      </Card>

      {/* Lessons Grid */}
      {lessons.length > 0 ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {lessons.map((lesson) => (
            <Card 
              key={lesson.id} 
              bg={cardBg} 
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} 
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => navigate(`/lessons/${lesson.id}`)}
            >
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Badge colorScheme={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                      <HStack fontSize="sm" color="gray.500">
                        <FiEye />
                        <Text>{lesson.views}</Text>
                      </HStack>
                    </HStack>
                    
                    <Heading size="md" noOfLines={2}>
                      {lesson.title}
                    </Heading>
                    
                    <Text fontSize="sm" color="primary.500" fontWeight="medium">
                      {lesson.subject} • {lesson.topic}
                    </Text>
                    
                    <Text color="gray.600" noOfLines={3} fontSize="sm">
                      {lesson.summary}
                    </Text>
                  </VStack>

                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between" fontSize="sm" color="gray.500">
                      <HStack>
                        <FiClock />
                        <Text>{lesson.durationMinutes} min</Text>
                      </HStack>
                      <HStack>
                        <FiUser />
                        <Text>AI Generated</Text>
                      </HStack>
                    </HStack>

                    <Button
                      as={Link}
                      to={`/lessons/${lesson.id}`}
                      colorScheme="primary"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Start Learning
                    </Button>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      ) : (
        <Card bg={cardBg}>
          <CardBody>
            <Center py={8}>
              <VStack spacing={4}>
                <Text fontSize="lg" color="gray.500">
                  No lessons found
                </Text>
                <Text color="gray.400" textAlign="center">
                  Try adjusting your search criteria or generate a new lesson with AI.
                </Text>
                <Button
                  leftIcon={<FiZap />}
                  colorScheme="primary"
                  onClick={() => navigate('/lessons/generate')}
                >
                  Generate Lesson with AI
                </Button>
              </VStack>
            </Center>
          </CardBody>
        </Card>
      )}

      {loading && lessons.length > 0 && (
        <Center>
          <Spinner color="primary.500" />
        </Center>
      )}
    </VStack>
  );
};

export default Lessons;