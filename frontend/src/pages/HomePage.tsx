import { 
  Container, 
  Heading, 
  Text, 
  Button, 
  Box, 
  SimpleGrid, 
  HStack
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

// CSS keyframe animations as strings for inline style
const fadeInUpAnimation = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const rotateAnimation = `
  @keyframes rotate {
    0% { transform: rotateZ(0deg); }
    100% { transform: rotateZ(360deg); }
  }
`

const floatElementAnimation = `
  @keyframes floatElement {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(50px, 50px); }
    50% { transform: translate(100px, -30px); }
    75% { transform: translate(-30px, 70px); }
  }
`

export default function HomePage() {
  return (
    <>
      {/* Inject keyframe animations */}
      <style>{fadeInUpAnimation + fadeInAnimation + rotateAnimation + floatElementAnimation}</style>
      
      <Box>
        {/* Hero Section */}
        <Box
        position="relative"
        overflow="hidden"
        bgGradient="linear(135deg, #f0f4ff 0%, #e6f7ff 100%)"
        py={{ base: '60px', md: '100px' }}
        pb={{ base: '60px', md: '80px' }}
        _before={{
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          bgGradient: 'radial(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      >
        <Container maxW="7xl" position="relative" zIndex={1}>
          <Box textAlign="center">
            {/* Hero Text */}
            <Box maxW="800px" mx="auto" mb="10">
              <Heading
                as="h1"
                fontSize={{ base: '2.5rem', md: '3.5rem', lg: '4rem' }}
                fontWeight="800"
                lineHeight="1.2"
                mb="5"
                color="gray.900"
                sx={{ animation: 'fadeInUp 1s ease' }}
              >
                Ignite Your Child's{' '}
                <Box
                  as="span"
                  position="relative"
                  bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                  bgClip="text"
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '5px',
                    left: 0,
                    width: '100%',
                    height: '10px',
                    bg: 'rgba(99, 102, 241, 0.2)',
                    zIndex: -1,
                    borderRadius: '5px',
                  }}
                >
                  Learning Journey
                </Box>
              </Heading>

              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color="gray.600"
                mb="10"
                fontWeight="500"
                sx={{ animation: 'fadeInUp 1s ease 0.2s both' }}
              >
                Premium educational books and interactive content for families
              </Text>

              <HStack
                spacing="5"
                flexWrap="wrap"
                justify="center"
                sx={{ animation: 'fadeInUp 1s ease 0.4s both' }}
              >
                <Button
                  as={RouterLink}
                  to="/products"
                  size="lg"
                  px="8"
                  py="6"
                  fontSize="md"
                  fontWeight="600"
                  bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                  color="white"
                  borderRadius="16px"
                  boxShadow="0 5px 15px rgba(99, 102, 241, 0.4)"
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.6)',
                  }}
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                >
                  Explore Products
                </Button>

                <Button
                  as={RouterLink}
                  to="/about"
                  size="lg"
                  px="8"
                  py="6"
                  fontSize="md"
                  fontWeight="600"
                  bg="transparent"
                  color="#6366f1"
                  border="2px solid"
                  borderColor="#6366f1"
                  borderRadius="16px"
                  _hover={{
                    bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                  }}
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                >
                  Learn More
                </Button>
              </HStack>
            </Box>

            {/* Hero 3D Graphic */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt="8"
              sx={{ animation: 'fadeIn 1s ease 0.6s both' }}
              style={{ perspective: '1000px' }}
            >
              <Box
                w={{ base: '150px', md: '200px' }}
                h={{ base: '150px', md: '200px' }}
                position="relative"
                style={{ transformStyle: 'preserve-3d' }}
                sx={{ animation: 'rotate 15s infinite linear' }}
              >
                {/* Book Stack */}
                <Box
                  position="relative"
                  w="100%"
                  h="100%"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Book 1 */}
                  <Box
                    position="absolute"
                    w="100%"
                    h="100%"
                    bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                    borderRadius="12px"
                    boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    style={{ transformStyle: 'preserve-3d' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize={{ base: '3xl', md: '5xl' }}
                    fontWeight="bold"
                    transform="rotateY(10deg) translateZ(40px)"
                  >
                  </Box>

                  {/* Book 2 */}
                  <Box
                    position="absolute"
                    w="100%"
                    h="100%"
                    bgGradient="linear(135deg, #8b5cf6, #6366f1)"
                    borderRadius="12px"
                    boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    style={{ transformStyle: 'preserve-3d' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize={{ base: '3xl', md: '5xl' }}
                    fontWeight="bold"
                    transform="rotateY(5deg) translateZ(20px)"
                  >
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Floating Elements */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          pointerEvents="none"
          zIndex={0}
        >
          <Box
            position="absolute"
            w="60px"
            h="60px"
            top="20%"
            left="10%"
            borderRadius="50%"
            bg="rgba(99, 102, 241, 0.1)"
            sx={{ animation: 'floatElement 15s infinite ease-in-out' }}
          />
          <Box
            position="absolute"
            w="40px"
            h="40px"
            top="60%"
            left="80%"
            borderRadius="50%"
            bg="rgba(99, 102, 241, 0.1)"
            sx={{ animation: 'floatElement 15s infinite ease-in-out 3s' }}
          />
          <Box
            position="absolute"
            w="80px"
            h="80px"
            top="40%"
            left="50%"
            borderRadius="50%"
            bg="rgba(99, 102, 241, 0.1)"
            sx={{ animation: 'floatElement 15s infinite ease-in-out 6s' }}
          />
        </Box>
      </Box>

      {/* Features Section */}
      <Container maxW="7xl" py="16">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="8">
          <Box 
            p="6" 
            bg="white" 
            borderRadius="16px" 
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{
              transform: 'translateY(-10px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Heading size="md" mb="4" color="gray.900">📚 Quality Products</Heading>
            <Text color="gray.600" fontWeight="500">
              Curated educational materials designed to make learning engaging and effective.
            </Text>
          </Box>

          <Box 
            p="6" 
            bg="white" 
            borderRadius="16px" 
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{
              transform: 'translateY(-10px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Heading size="md" mb="4" color="gray.900">🌍 Multi-Language</Heading>
            <Text color="gray.600" fontWeight="500">
              Support for multiple languages including English, Hindi, and Telugu.
            </Text>
          </Box>

          <Box 
            p="6" 
            bg="white" 
            borderRadius="16px" 
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{
              transform: 'translateY(-10px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Heading size="md" mb="4" color="gray.900">🎯 Age-Appropriate</Heading>
            <Text color="gray.600" fontWeight="500">
              Products categorized by age groups to ensure perfect developmental fit.
            </Text>
          </Box>
        </SimpleGrid>
      </Container>
      </Box>
    </>
  )
}