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
  Center
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiUser, FiEye } from 'react-icons/fi';
import axios from 'axios';

interface Lesson {
  _id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  summary: string;
  tags: string[];
  views: number;
  rating: {
    average: number;
    count: number;
  };
  createdBy: {
    displayName: string;
  };
}

const Lessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);

  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchLessons();
  }, [searchTerm, selectedSubject, selectedDifficulty]);

  const fetchLessons = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSubject) params.append('subject', selectedSubject);
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/lessons?${params}`);
      setLessons(response.data.lessons || []);
      
      // Extract unique subjects
      const uniqueSubjects = [...new Set(response.data.lessons?.map((lesson: Lesson) => lesson.subject) || [])];
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>Browse Lessons</Heading>
        <Text color="gray.600">Discover and learn from our comprehensive lesson library</Text>
      </Box>

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
            <Card key={lesson._id} bg={cardBg} _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
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
                        <Text>{lesson.createdBy?.displayName || 'Anonymous'}</Text>
                      </HStack>
                    </HStack>

                    <Button
                      as={Link}
                      to={`/lessons/${lesson._id}`}
                      colorScheme="primary"
                      size="sm"
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
                  Try adjusting your search criteria or check back later for new content.
                </Text>
              </VStack>
            </Center>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default Lessons;