import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  HStack,
  Select,
  PinInput,
  PinInputField,
} from '@chakra-ui/react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function OtpLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [countdown, setCountdown] = useState(0)
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const syncCart = useCartStore((state) => state.syncCart)

  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: authService.sendOtp,
    onSuccess: () => {
      setOtpSent(true)
      setCountdown(120) // 2 minutes countdown
      toast({
        title: 'OTP Sent',
        description: 'Verification code sent to your phone',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
    onError: (error: any) => {
      console.error('Send OTP Error:', error)
      console.error('Error Response:', error.response)
      console.error('Validation Errors:', error.response?.data?.errors)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.response?.data?.title || 'Failed to send OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  // OTP login mutation
  const otpLoginMutation = useMutation({
    mutationFn: authService.loginWithOtp,
    onSuccess: async (data) => {
      setAuth(data.data.user) // No token parameter needed after cookie-based auth migration
      
      // Clear any cached orders from previous user
      queryClient.clear()
      
      // Sync cart with backend after login
      try {
        await syncCart()
      } catch (error) {
        console.error('Failed to sync cart after login:', error)
      }
      
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      navigate('/')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Login failed'
      setErrors({ general: errorMessage })
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!phoneNumber || phoneNumber.length < 10) {
      setErrors({ phoneNumber: 'Please enter a valid phone number' })
      return
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    sendOtpMutation.mutate({
      phoneNumber: fullPhoneNumber,
      purpose: 'login',
    })
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (otpCode.length !== 6) {
      setErrors({ otpCode: 'Please enter the 6-digit OTP' })
      return
    }

    otpLoginMutation.mutate({
      phoneNumber: `${countryCode}${phoneNumber}`,
      otpCode,
    })
  }

  const handleResendOtp = () => {
    if (countdown > 0) return
    
    sendOtpMutation.mutate({
      phoneNumber: `${countryCode}${phoneNumber}`,
      purpose: 'login',
    })
  }

  return (
    <Container maxW="md" py={12}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" size="lg" color="teal.600">
            Login with OTP
          </Heading>

          {!otpSent ? (
            // Step 1: Phone Number Entry
            <form onSubmit={handleSendOtp}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.phoneNumber}>
                  <FormLabel>Phone Number</FormLabel>
                  <HStack>
                    <Select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      size="lg"
                      width="120px"
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+65">🇸🇬 +65</option>
                    </Select>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      size="lg"
                      flex="1"
                    />
                  </HStack>
                  <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  width="100%"
                  isLoading={sendOtpMutation.isPending}
                >
                  Send OTP
                </Button>

                <Text textAlign="center" fontSize="sm" color="gray.600">
                  We'll send a 6-digit verification code to your phone
                </Text>

                <Text textAlign="center" fontSize="sm">
                  or{' '}
                  <Link as={RouterLink} to="/login" color="teal.500">
                    Login with Email
                  </Link>
                </Text>
              </VStack>
            </form>
          ) : (
            // Step 2: OTP Verification
            <form onSubmit={handleVerifyOtp}>
              <VStack spacing={4}>
                <Text textAlign="center" color="gray.600">
                  Enter the 6-digit code sent to
                  <br />
                  <strong>{countryCode}{phoneNumber}</strong>
                </Text>

                <FormControl isInvalid={!!errors.otpCode}>
                  <FormLabel textAlign="center">Verification Code</FormLabel>
                  <HStack justify="center">
                    <PinInput
                      size="lg"
                      value={otpCode}
                      onChange={setOtpCode}
                      otp
                    >
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                  <FormErrorMessage justifyContent="center">
                    {errors.otpCode}
                  </FormErrorMessage>
                </FormControl>

                {errors.general && (
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    {errors.general}
                  </Text>
                )}

                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  width="100%"
                  isLoading={otpLoginMutation.isPending}
                >
                  Verify & Login
                </Button>

                <HStack spacing={2} justify="center">
                  <Text fontSize="sm" color="gray.600">
                    {countdown > 0
                      ? `Resend OTP in ${countdown}s`
                      : "Didn't receive the code?"}
                  </Text>
                  {countdown === 0 && (
                    <Button
                      variant="link"
                      colorScheme="teal"
                      size="sm"
                      onClick={handleResendOtp}
                      isLoading={sendOtpMutation.isPending}
                    >
                      Resend
                    </Button>
                  )}
                </HStack>

                <Button
                  variant="link"
                  colorScheme="gray"
                  size="sm"
                  onClick={() => {
                    setOtpSent(false)
                    setOtpCode('')
                    setErrors({})
                  }}
                >
                  Change Phone Number
                </Button>
              </VStack>
            </form>
          )}

          <Text textAlign="center" fontSize="sm">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="teal.500">
              Register
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}
