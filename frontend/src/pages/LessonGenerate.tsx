import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Card,
  CardBody,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  Divider
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiZap, FiBook } from 'react-icons/fi';
import { useLessonStore, LessonGenerationRequest } from '../stores/lessonStore';

const LessonGenerate: React.FC = () => {
  const navigate = useNavigate();
  const { generateLesson, loading, error, clearError } = useLessonStore();
  
  const [formData, setFormData] = useState<LessonGenerationRequest>({
    subject: '',
    topic: '',
    difficulty: 'beginner',
    durationMinutes: 30,
    learningObjectives: [],
    includeExercises: true
  });
  
  const [objectives, setObjectives] = useState('');
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);

  const cardBg = useColorModeValue('white', 'gray.800');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const request = {
        ...formData,
        learningObjectives: objectives 
          ? objectives.split('\n').filter(obj => obj.trim())
          : undefined
      };

      const lesson = await generateLesson(request);
      setGeneratedLesson(lesson);
    } catch (error) {
      console.error('Failed to generate lesson:', error);
    }
  };

  const handleInputChange = (field: keyof LessonGenerationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (generatedLesson) {
    return (
      <VStack spacing={6} align="stretch">
        <HStack>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => setGeneratedLesson(null)}
          >
            Generate Another
          </Button>
        </HStack>

        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Heading size="lg">{generatedLesson.title}</Heading>
                  <HStack>
                    <Badge colorScheme="blue">{generatedLesson.subject}</Badge>
                    <Badge colorScheme="green">{generatedLesson.difficulty}</Badge>
                    <Badge colorScheme="purple">{generatedLesson.durationMinutes} min</Badge>
                  </HStack>
                </VStack>
                <Button
                  colorScheme="primary"
                  leftIcon={<FiBook />}
                  onClick={() => navigate(`/lessons/${generatedLesson.id}`)}
                >
                  Start Learning
                </Button>
              </HStack>

              <Text color="gray.600">{generatedLesson.summary}</Text>

              <Divider />

              <Box>
                <Heading size="md" mb={3}>Content Sections</Heading>
                <VStack spacing={3} align="stretch">
                  {generatedLesson.content.map((section: any, index: number) => (
                    <Card key={section.id} variant="outline">
                      <CardBody>
                        <Heading size="sm" mb={2}>{section.title}</Heading>
                        <Text fontSize="sm" noOfLines={3}>{section.content}</Text>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </Box>

              {generatedLesson.exercises && generatedLesson.exercises.length > 0 && (
                <Box>
                  <Heading size="md" mb={3}>Exercises ({generatedLesson.exercises.length})</Heading>
                  <VStack spacing={3} align="stretch">
                    {generatedLesson.exercises.slice(0, 3).map((exercise: any, index: number) => (
                      <Card key={exercise.id} variant="outline">
                        <CardBody>
                          <Text fontWeight="medium" mb={2}>{exercise.question}</Text>
                          <VStack spacing={1} align="stretch" fontSize="sm">
                            {exercise.options.map((option: string, optIndex: number) => (
                              <Text 
                                key={optIndex}
                                color={option === exercise.correctAnswer ? 'green.500' : 'gray.600'}
                                fontWeight={option === exercise.correctAnswer ? 'bold' : 'normal'}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </Text>
                            ))}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch" maxW="2xl">
      <HStack>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/lessons')}
        >
          Back to Lessons
        </Button>
      </HStack>

      <Box>
        <Heading size="lg" mb={2}>
          <HStack>
            <FiZap />
            <Text>Generate AI Lesson</Text>
          </HStack>
        </Heading>
        <Text color="gray.600">
          Create personalized lessons using AI based on your preferences
        </Text>
      </Box>

      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Card bg={cardBg}>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <HStack w="full" spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Subject</FormLabel>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="e.g., Mathematics, Science, History"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Topic</FormLabel>
                  <Input
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder="e.g., Algebra, Photosynthesis, World War II"
                  />
                </FormControl>
              </HStack>

              <HStack w="full" spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value as any)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <Select
                    value={formData.durationMinutes}
                    onChange={(e) => handleInputChange('durationMinutes', parseInt(e.target.value))}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Learning Objectives (optional)</FormLabel>
                <Textarea
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="Enter learning objectives, one per line:&#10;- Understand basic concepts&#10;- Apply knowledge to real-world examples&#10;- Solve practice problems"
                  rows={4}
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Enter each objective on a new line
                </Text>
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                size="lg"
                w="full"
                leftIcon={<FiZap />}
                isLoading={loading}
                loadingText="Generating lesson..."
              >
                Generate Lesson with AI
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>

      {loading && (
        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={4}>
              <Spinner size="lg" color="primary.500" />
              <VStack spacing={2}>
                <Text fontWeight="medium">Generating your personalized lesson...</Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Our AI is creating content tailored to your specifications. This may take a moment.
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default LessonGenerate;