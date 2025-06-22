import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Progress,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiBook, FiClock, FiTrendingUp, FiTarget } from 'react-icons/fi';
import axios from 'axios';

interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  totalTimeSpent: number;
  weeklyProgress: number;
}

interface RecentActivity {
  id: string;
  type: 'lesson_completed' | 'qa_session' | 'lesson_started';
  title: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLessons: 0,
    completedLessons: 0,
    totalTimeSpent: 0,
    weeklyProgress: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/me/completion-stats`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/me/activity?limit=5`)
      ]);

      setStats(statsResponse.data);
      setRecentActivity(activityResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0;

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>Welcome back!</Heading>
        <Text color="gray.600">Here's your learning progress overview</Text>
      </Box>

      {/* Stats Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiBook />
                  <Text>Total Lessons</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{stats.totalLessons}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {stats.completedLessons} completed
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiTarget />
                  <Text>Completion Rate</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{completionRate.toFixed(1)}%</StatNumber>
              <StatHelpText>
                <Progress value={completionRate} colorScheme="green" size="sm" mt={2} />
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiClock />
                  <Text>Time Spent</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{Math.round(stats.totalTimeSpent / 60)}h</StatNumber>
              <StatHelpText>Total learning time</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <FiTrendingUp />
                  <Text>Weekly Progress</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{stats.weeklyProgress}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                This week
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Card bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <HStack spacing={4} wrap="wrap">
            <Button as={Link} to="/lessons" colorScheme="primary" leftIcon={<FiBook />}>
              Browse Lessons
            </Button>
            <Button as={Link} to="/qa" variant="outline" leftIcon={<FiBook />}>
              Ask AI Tutor
            </Button>
            <Button as={Link} to="/analytics" variant="outline" leftIcon={<FiTrendingUp />}>
              View Analytics
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <VStack spacing={3} align="stretch">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <HStack key={activity.id} justify="space-between" p={3} bg="gray.50" rounded="md">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{activity.title}</Text>
                    <Badge colorScheme={
                      activity.type === 'lesson_completed' ? 'green' :
                      activity.type === 'qa_session' ? 'blue' : 'orange'
                    }>
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </VStack>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </Text>
                </HStack>
              ))
            ) : (
              <Text color="gray.500" textAlign="center" py={4}>
                No recent activity. Start learning to see your progress here!
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Dashboard;