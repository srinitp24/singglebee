import {
  Container,
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FiUser, FiMail, FiPhone, FiShield, FiCheckCircle, FiXCircle, FiMapPin, FiEdit } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import { Navigate, Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { userService } from '../services/userService'

export default function ProfilePage() {
  const { user, isAuthenticated, isAdmin, setAuth } = useAuthStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
    country: user?.country || '',
  })

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      // Get current token
      const token = localStorage.getItem('token') || ''
      
      // Update auth store with data from backend
      setAuth(data.data, token)
      
      toast({
        title: 'Profile updated successfully',
        description: 'Your profile information has been saved.',
        status: 'success',
        duration: 3000,
      })
      
      onClose()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      toast({
        title: 'Update failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      })
    },
  })

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const handleSave = () => {
    // Check if any changes were made
    const hasChanges = 
      formData.name !== user.name ||
      (formData.phone || '') !== (user.phone || '') ||
      (formData.address || '') !== (user.address || '') ||
      (formData.city || '') !== (user.city || '') ||
      (formData.state || '') !== (user.state || '') ||
      (formData.postalCode || '') !== (user.postalCode || '') ||
      (formData.country || '') !== (user.country || '')

    if (!hasChanges) {
      toast({
        title: 'No changes made',
        description: 'You have not made any changes to your profile.',
        status: 'info',
        duration: 3000,
      })
      return
    }

    updateProfileMutation.mutate({
      name: formData.name,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      postalCode: formData.postalCode || undefined,
      country: formData.country || undefined,
    })
  }

  return (
    <Container maxW="4xl" py="8">
      <VStack spacing="6" align="stretch">
        <HStack justify="space-between">
          <Heading>My Profile</Heading>
          <Button
            leftIcon={<FiEdit />}
            colorScheme="purple"
            onClick={onOpen}
          >
            Edit Profile
          </Button>
        </HStack>

        {/* Profile Card */}
        <Card>
          <CardBody>
            <VStack spacing="6" align="stretch">
              {/* Avatar and Basic Info */}
              <HStack spacing="6">
                <Avatar
                  size="2xl"
                  name={user.name}
                  bg="purple.500"
                  color="white"
                />
                <VStack align="start" spacing="2" flex="1">
                  <Heading size="lg">{user.name}</Heading>
                  <HStack>
                    {isAdmin() && (
                      <Badge colorScheme="purple" fontSize="md">
                        ADMIN
                      </Badge>
                    )}
                    {user.emailVerified ? (
                      <Badge colorScheme="green" fontSize="md">
                        <HStack spacing="1">
                          <Icon as={FiCheckCircle} />
                          <Text>Verified</Text>
                        </HStack>
                      </Badge>
                    ) : (
                      <Badge colorScheme="orange" fontSize="md">
                        <HStack spacing="1">
                          <Icon as={FiXCircle} />
                          <Text>Unverified</Text>
                        </HStack>
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </HStack>

              <Divider />

              {/* User Details */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                <Box>
                  <HStack spacing="3" mb="2">
                    <Icon as={FiUser} color="purple.500" boxSize="5" />
                    <Text fontWeight="semibold" color="gray.600">
                      Full Name
                    </Text>
                  </HStack>
                  <Text fontSize="lg" ml="8">
                    {user.name}
                  </Text>
                </Box>

                <Box>
                  <HStack spacing="3" mb="2">
                    <Icon as={FiMail} color="purple.500" boxSize="5" />
                    <Text fontWeight="semibold" color="gray.600">
                      Email Address
                    </Text>
                  </HStack>
                  <Text fontSize="lg" ml="8">
                    {user.email}
                  </Text>
                </Box>

                {user.phone && (
                  <Box>
                    <HStack spacing="3" mb="2">
                      <Icon as={FiPhone} color="purple.500" boxSize="5" />
                      <Text fontWeight="semibold" color="gray.600">
                        Phone Number
                      </Text>
                    </HStack>
                    <Text fontSize="lg" ml="8">
                      {user.phone}
                    </Text>
                  </Box>
                )}

                <Box gridColumn={{ base: '1', md: '1 / -1' }}>
                  <HStack spacing="3" mb="2">
                    <Icon as={FiMapPin} color="purple.500" boxSize="5" />
                    <Text fontWeight="semibold" color="gray.600">
                      Address
                    </Text>
                  </HStack>
                  {(user.address || user.city || user.state || user.postalCode || user.country) ? (
                    <VStack align="start" ml="8" spacing="1">
                      {user.address && <Text fontSize="lg">{user.address}</Text>}
                      <Text fontSize="lg">
                        {[user.city, user.state, user.postalCode].filter(Boolean).join(', ')}
                      </Text>
                      {user.country && <Text fontSize="lg">{user.country}</Text>}
                    </VStack>
                  ) : (
                    <Text fontSize="lg" ml="8" color="gray.400" fontStyle="italic">
                      No address added yet
                    </Text>
                  )}
                </Box>

                {isAdmin() && (
                  <Box>
                    <HStack spacing="3" mb="2">
                      <Icon as={FiShield} color="purple.500" boxSize="5" />
                      <Text fontWeight="semibold" color="gray.600">
                        Account Role
                      </Text>
                    </HStack>
                    <Text fontSize="lg" ml="8" textTransform="capitalize">
                      {user.role}
                    </Text>
                  </Box>
                )}

                <Box>
                  <HStack spacing="3" mb="2">
                    <Icon as={FiCheckCircle} color="purple.500" boxSize="5" />
                    <Text fontWeight="semibold" color="gray.600">
                      Email Status
                    </Text>
                  </HStack>
                  <Text fontSize="lg" ml="8">
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </Text>
                </Box>
              </SimpleGrid>

              <Divider />

              {/* Quick Actions */}
              <VStack spacing="3" align="stretch">
                <Text fontWeight="semibold" color="gray.700">
                  Quick Actions
                </Text>
                <HStack spacing="3">
                  {isAdmin() && (
                    <Button
                      as={RouterLink}
                      to="/admin"
                      colorScheme="purple"
                      leftIcon={<FiShield />}
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    as={RouterLink}
                    to="/products"
                    variant="outline"
                    colorScheme="purple"
                  >
                    Browse Products
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                />
              </FormControl>

              <HStack width="100%" spacing="4">
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>State/Province</FormLabel>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </FormControl>
              </HStack>

              <HStack width="100%" spacing="4">
                <FormControl>
                  <FormLabel>Postal Code</FormLabel>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr="3" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="purple" 
              onClick={handleSave}
              isLoading={updateProfileMutation.isPending}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}
