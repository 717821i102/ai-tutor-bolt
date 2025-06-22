import React from 'react';
import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';

const Analytics: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');

  // Mock data - replace with real analytics data
  const stats = {
    totalTimeSpent: 1250, // minutes
    lessonsCompleted: 15,
    averageScore: 87,
    streakDays: 7,
    weeklyProgress: [20, 35, 45, 60, 75, 85, 90]
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>Learning Analytics</Heading>
        <Text color="gray.600">Track your progress and performance</Text>
      </Box>

      {/* Overview Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Total Study Time</StatLabel>
              <StatNumber>{Math.round(stats.totalTimeSpent / 60)}h {stats.totalTimeSpent % 60}m</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Lessons Completed</StatLabel>
              <StatNumber>{stats.lessonsCompleted}</StatNumber>
              <StatHelpText>Total completed</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Average Score</StatLabel>
              <StatNumber>{stats.averageScore}%</StatNumber>
              <StatHelpText>Across all exercises</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Current Streak</StatLabel>
              <StatNumber>{stats.streakDays}</StatNumber>
              <StatHelpText>Days in a row</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Weekly Progress */}
      <Card bg={cardBg}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Weekly Progress</Heading>
            <Box>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <Box key={day} mb={3}>
                  <Text fontSize="sm" mb={1}>{day}</Text>
                  <Progress
                    value={stats.weeklyProgress[index]}
                    colorScheme="primary"
                    size="sm"
                  />
                </Box>
              ))}
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Performance by Subject */}
      <Card bg={cardBg}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Performance by Subject</Heading>
            <VStack spacing={3} align="stretch">
              {[
                { subject: 'Mathematics', score: 92, lessons: 8 },
                { subject: 'Science', score: 85, lessons: 5 },
                { subject: 'History', score: 78, lessons: 2 }
              ].map((item) => (
                <Box key={item.subject}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Text fontWeight="medium">{item.subject}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {item.score}% • {item.lessons} lessons
                    </Text>
                  </Box>
                  <Progress value={item.score} colorScheme="green" size="sm" />
                </Box>
              ))}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Analytics;