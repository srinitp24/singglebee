import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  Container,
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  Link,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [errors, setErrors] = useState<any>({})
  const navigate = useNavigate()
  const toast = useToast()
  const setAuth = useAuthStore((state) => state.setAuth)

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token)
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 3000,
      })
      navigate('/')
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Please check your information',
        status: 'error',
        duration: 5000,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: any = {}
    if (!formData.name) newErrors.name = true
    if (!formData.email) newErrors.email = true
    if (!formData.password) newErrors.password = true
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    registerMutation.mutate(formData)
  }

  return (
    <Container maxW="md" py="16">
      <Box bg="white" p="8" borderRadius="lg" boxShadow="md">
        <VStack spacing="6" as="form" onSubmit={handleSubmit}>
          <Heading>Sign Up</Heading>

          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
            />
            <FormErrorMessage>Name is required</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
            <FormErrorMessage>Email is required</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Phone (Optional)</FormLabel>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 1234567890"
            />
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
            />
            <Text fontSize="xs" color="gray.600" mt="1">
              Must contain uppercase, lowercase, number and special character (@$!%*?&)
            </Text>
            <FormErrorMessage>Password is required</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm password"
            />
            <FormErrorMessage>Passwords must match</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="purple"
            width="full"
            isLoading={registerMutation.isPending}
          >
            Sign Up
          </Button>

          <Text fontSize="sm">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="purple.500">
              Login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}
