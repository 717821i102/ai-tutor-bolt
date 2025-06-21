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
  Avatar,
  Card,
  CardBody,
  useColorModeValue,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call to update profile
      setTimeout(() => {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <VStack spacing={6} align="stretch" maxW="2xl">
      <Box>
        <Heading size="lg" mb={2}>Profile</Heading>
        <Text color="gray.600">Manage your account information</Text>
      </Box>

      {message && (
        <Alert status="success">
          <AlertIcon />
          {message}
        </Alert>
      )}

      <Card bg={cardBg}>
        <CardBody>
          <VStack spacing={6}>
            <VStack spacing={4}>
              <Avatar
                size="xl"
                name={user?.displayName}
                src={user?.avatarUrl}
              />
              <VStack spacing={1}>
                <Heading size="md">{user?.displayName}</Heading>
                <Text color="gray.500">{user?.email}</Text>
              </VStack>
            </VStack>

            <Box w="full">
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  />
                </FormControl>

                <HStack w="full" justify="flex-end" spacing={3}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        leftIcon={<FiX />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        colorScheme="primary"
                        leftIcon={<FiSave />}
                        onClick={handleSave}
                        isLoading={loading}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      colorScheme="primary"
                      leftIcon={<FiEdit />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Profile;