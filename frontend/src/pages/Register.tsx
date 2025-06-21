import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  Alert,
  AlertIcon,
  Divider,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(email, password, displayName);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      py={12}
      px={4}
    >
      <Box
        maxW="md"
        w="full"
        bg={bg}
        boxShadow="lg"
        rounded="lg"
        p={8}
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6}>
          <VStack spacing={2}>
            <Heading size="lg" textAlign="center" color="primary.500">
              AI Tutor Pro
            </Heading>
            <Text color="gray.600" textAlign="center">
              Create your account
            </Text>
          </VStack>

          {error && (
            <Alert status="error" rounded="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Box w="full">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    leftIcon={<FiUser />}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    leftIcon={<FiMail />}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    leftIcon={<FiLock />}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Creating account..."
                >
                  Sign Up
                </Button>
              </VStack>
            </form>

            <VStack spacing={4} mt={6}>
              <HStack w="full">
                <Divider />
                <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                  or continue with
                </Text>
                <Divider />
              </HStack>

              <Button
                variant="outline"
                size="lg"
                w="full"
                leftIcon={<FaGoogle />}
                onClick={handleGoogleLogin}
                isLoading={loading}
              >
                Google
              </Button>
            </VStack>
          </Box>

          <Text fontSize="sm" color="gray.600">
            Already have an account?{' '}
            <ChakraLink as={Link} to="/login" color="primary.500" fontWeight="medium">
              Sign in
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;