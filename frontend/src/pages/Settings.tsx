import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Button,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

const Settings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [dailyGoal, setDailyGoal] = useState('30');
  const [message, setMessage] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');

  const handleSave = () => {
    // Simulate saving settings
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <VStack spacing={6} align="stretch" maxW="2xl">
      <Box>
        <Heading size="lg" mb={2}>Settings</Heading>
        <Text color="gray.600">Customize your learning experience</Text>
      </Box>

      {message && (
        <Alert status="success">
          <AlertIcon />
          {message}
        </Alert>
      )}

      {/* Notifications */}
      <Card bg={cardBg}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Notifications</Heading>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-notifications" mb="0" flex="1">
                Email Notifications
                <Text fontSize="sm" color="gray.500">
                  Receive updates about your progress via email
                </Text>
              </FormLabel>
              <Switch
                id="email-notifications"
                isChecked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="push-notifications" mb="0" flex="1">
                Push Notifications
                <Text fontSize="sm" color="gray.500">
                  Get notified about new lessons and achievements
                </Text>
              </FormLabel>
              <Switch
                id="push-notifications"
                isChecked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="reminders" mb="0" flex="1">
                Study Reminders
                <Text fontSize="sm" color="gray.500">
                  Daily reminders to keep you on track
                </Text>
              </FormLabel>
              <Switch
                id="reminders"
                isChecked={reminders}
                onChange={(e) => setReminders(e.target.checked)}
              />
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      {/* Learning Preferences */}
      <Card bg={cardBg}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Learning Preferences</Heading>
            
            <FormControl>
              <FormLabel>Default Difficulty Level</FormLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Daily Learning Goal (minutes)</FormLabel>
              <Select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </Select>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      <Button colorScheme="primary" onClick={handleSave}>
        Save Settings
      </Button>
    </VStack>
  );
};

export default Settings;