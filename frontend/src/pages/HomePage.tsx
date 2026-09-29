import { 
  Container, 
  Heading, 
  Text, 
  Button, 
  Box, 
  SimpleGrid, 
  HStack,
  Icon,
  Input,
  Textarea,
  VStack,
  List,
  ListItem
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaBookOpen, FaLaptop, FaGift, FaHeadset, FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'

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

const scrollAnimation = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`

const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 30px 80px rgba(99, 102, 241, 0.6);
    }
  }
`

const floatIconAnimation = `
  @keyframes floatIcon {
    0%, 100% { 
      transform: translateY(0) rotate(0deg);
    }
    25% { 
      transform: translateY(-10px) rotate(-3deg);
    }
    50% { 
      transform: translateY(-20px) rotate(0deg);
    }
    75% { 
      transform: translateY(-10px) rotate(3deg);
    }
  }
`

const bounceAnimation = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`

export default function HomePage() {
  return (
    <>
      {/* Inject keyframe animations */}
      <style>{fadeInUpAnimation + fadeInAnimation + rotateAnimation + floatElementAnimation + scrollAnimation + pulseAnimation + floatIconAnimation + bounceAnimation}</style>
      
      <Box>
        {/* Announcement Banner */}
        <Box
          bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
          color="white"
          py="3"
          overflow="hidden"
          position="relative"
        >
          <Box
            display="flex"
            whiteSpace="nowrap"
            sx={{
              animation: 'scroll 20s linear infinite',
              '&:hover': {
                animationPlayState: 'paused'
              }
            }}
          >
            <Text fontSize="sm" fontWeight="500" px="4">
              🎉 New arrivals! Explore our latest educational books for kids
            </Text>
            <Text fontSize="sm" fontWeight="500" px="4">
              📚 Free shipping on orders above ₹500
            </Text>
            <Text fontSize="sm" fontWeight="500" px="4">
              ⭐ Join our community of 10,000+ happy parents
            </Text>
            <Text fontSize="sm" fontWeight="500" px="4">
              🎁 Special discount on first purchase - Use code WELCOME10
            </Text>
            {/* Duplicate for seamless loop */}
            <Text fontSize="sm" fontWeight="500" px="4">
              🎉 New arrivals! Explore our latest educational books for kids
            </Text>
            <Text fontSize="sm" fontWeight="500" px="4">
              📚 Free shipping on orders above ₹500
            </Text>
            <Text fontSize="sm" fontWeight="500" px="4">
              ⭐ Join our community of 10,000+ happy parents
            </Text>
            <Text fontSize="sm" fontWeight="500" px="4">
              🎁 Special discount on first purchase - Use code WELCOME10
            </Text>
          </Box>
        </Box>

        {/* Hero Section */}
        <Box
        id="home"
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
          <Box
            display="flex"
            flexDirection={{ base: 'column', lg: 'row' }}
            alignItems="center"
            gap={{ base: '10', lg: '12' }}
          >
            {/* Hero Text */}
            <Box flex="1" maxW={{ base: '100%', lg: '600px' }}>
              <Heading
                as="h1"
                fontSize={{ base: '2.5rem', md: '3.5rem', lg: '4rem' }}
                fontWeight="800"
                lineHeight="1.2"
                mb="5"
                color="gray.900"
                sx={{ animation: 'fadeInUp 1s ease' }}
                textAlign="center"
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
                textAlign="center"
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

            {/* Hero 3D Graphic - Book Stack */}
            <Box
              flex="1"
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ animation: 'fadeIn 1s ease 0.6s both' }}
              style={{ perspective: '1000px' }}
            >
              <Box
                w={{ base: '200px', md: '250px', lg: '300px' }}
                h={{ base: '200px', md: '250px', lg: '300px' }}
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

      {/* About Us Section */}
      <Box id="about" bg="white" py="20" position="relative">
        <Container maxW="7xl">
          <Box
            display="flex"
            flexDirection={{ base: 'column', lg: 'row' }}
            alignItems="center"
            gap={{ base: '12', lg: '60px' }}
            position="relative"
            zIndex={1}
          >
            {/* About Text */}
            <Box flex="1">
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                fontWeight="800"
                mb="6"
                bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                bgClip="text"
                sx={{ animation: 'fadeInUp 0.8s ease' }}
              >
                About SINGGLEBEE
              </Heading>
              
              <Text
                fontSize="lg"
                color="gray.600"
                mb="4"
                lineHeight="1.8"
                sx={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}
              >
                We are dedicated to providing high-quality educational resources that foster growth and development in children. Our carefully curated collection of books and interactive content is designed to make learning fun and engaging.
              </Text>
              
              <Text
                fontSize="lg"
                color="gray.600"
                mb="10"
                lineHeight="1.8"
                sx={{ animation: 'fadeInUp 0.8s ease 0.3s both' }}
              >
                With a focus on families, we ensure our products are accessible, inclusive, and beneficial for children of all backgrounds.
              </Text>

              {/* Stats */}
              <Box
                display="flex"
                gap="10"
                flexWrap="wrap"
                sx={{ animation: 'fadeInUp 0.8s ease 0.4s both' }}
              >
                <Box textAlign="center" flex="1" minW="150px">
                  <Heading
                    as="h3"
                    fontSize="4xl"
                    fontWeight="800"
                    bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                    bgClip="text"
                    mb="2"
                  >
                    1000+
                  </Heading>
                  <Text fontSize="md" color="gray.600" fontWeight="600">
                    Happy Families
                  </Text>
                </Box>

                <Box textAlign="center" flex="1" minW="150px">
                  <Heading
                    as="h3"
                    fontSize="4xl"
                    fontWeight="800"
                    bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                    bgClip="text"
                    mb="2"
                  >
                    50+
                  </Heading>
                  <Text fontSize="md" color="gray.600" fontWeight="600">
                    Quality Books
                  </Text>
                </Box>

                <Box textAlign="center" flex="1" minW="150px">
                  <Heading
                    as="h3"
                    fontSize="4xl"
                    fontWeight="800"
                    bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                    bgClip="text"
                    mb="2"
                  >
                    98%
                  </Heading>
                  <Text fontSize="md" color="gray.600" fontWeight="600">
                    Satisfaction Rate
                  </Text>
                </Box>
              </Box>
            </Box>

            {/* About Image/Graphic */}
            <Box
              flex="1"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                w="350px"
                h="350px"
                bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 20px 60px rgba(99, 102, 241, 0.4)"
                sx={{ animation: 'pulse 4s ease-in-out infinite' }}
                position="relative"
                overflow="hidden"
              >
                <Text
                  fontSize="8rem"
                  color="white"
                  textShadow="0 5px 15px rgba(0, 0, 0, 0.2)"
                  zIndex={1}
                  sx={{ animation: 'floatIcon 3s ease-in-out infinite' }}
                >
                  👨‍👩‍👧‍👦
                </Text>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box
        id="services" bg="white" py="20" position="relative">
        <Container maxW="7xl">
          <Box textAlign="center" mb="60px" position="relative">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="800"
              mb="4"
              color="gray.900"
              position="relative"
              display="inline-block"
              sx={{ animation: 'fadeInUp 0.8s ease' }}
              _after={{
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                borderRadius: '2px',
              }}
            >
              Our Services
            </Heading>
            <Text
              fontSize="xl"
              color="gray.600"
              maxW="600px"
              mx="auto"
              mt="8"
              fontWeight="500"
              sx={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}
            >
              Comprehensive learning solutions for your family
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="35px">
            {/* Service Card 1 */}
            <Box
              bg="white"
              borderRadius="16px"
              p="40px 30px"
              textAlign="center"
              boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              position="relative"
              overflow="hidden"
              zIndex={1}
              sx={{ animation: 'fadeInUp 0.6s ease' }}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '0',
                bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: -1,
                opacity: 0.1,
              }}
              _hover={{
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                _before: {
                  height: '100%',
                },
                '& .service-icon': {
                  transform: 'scale(1.1) rotate(10deg)',
                  boxShadow: '0 15px 30px rgba(99, 102, 241, 0.5)',
                },
                '& h3': {
                  color: '#6366f1',
                },
              }}
            >
              <Box
                className="service-icon"
                w="90px"
                h="90px"
                bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb="25px"
                fontSize="2.5rem"
                color="white"
                boxShadow="0 10px 20px rgba(99, 102, 241, 0.3)"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              >
                <Icon as={FaBookOpen} />
              </Box>
              <Heading
                as="h3"
                fontSize="1.5rem"
                mb="20px"
                color="gray.900"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              >
                Educational Books
              </Heading>
              <Text color="gray.600" fontWeight="500">
                Premium quality books for all age groups
              </Text>
            </Box>

            {/* Service Card 2 */}
            <Box
              bg="white"
              borderRadius="16px"
              p="40px 30px"
              textAlign="center"
              boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              position="relative"
              overflow="hidden"
              zIndex={1}
              sx={{ animation: 'fadeInUp 0.6s ease 0.1s both' }}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '0',
                bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: -1,
                opacity: 0.1,
              }}
              _hover={{
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                _before: {
                  height: '100%',
                },
                '& .service-icon': {
                  transform: 'scale(1.1) rotate(10deg)',
                  boxShadow: '0 15px 30px rgba(99, 102, 241, 0.5)',
                },
                '& h3': {
                  color: '#6366f1',
                },
              }}
            >
              <Box
                className="service-icon"
                w="90px"
                h="90px"
                bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb="25px"
                fontSize="2.5rem"
                color="white"
                boxShadow="0 10px 20px rgba(99, 102, 241, 0.3)"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              >
                <Icon as={FaLaptop} />
              </Box>
              <Heading
                as="h3"
                fontSize="1.5rem"
                mb="20px"
                color="gray.900"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              >
                Digital Content
              </Heading>
              <Text color="gray.600" fontWeight="500">
                Interactive flipbooks and video content
              </Text>
            </Box>

            {/* Service Card 3 */}
            <Box
              bg="white"
              borderRadius="16px"
              p="40px 30px"
              textAlign="center"
              boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              position="relative"
              overflow="hidden"
              zIndex={1}
              sx={{ animation: 'fadeInUp 0.6s ease 0.2s both' }}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '0',
                bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: -1,
                opacity: 0.1,
              }}
              _hover={{
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                _before: {
                  height: '100%',
                },
                '& .service-icon': {
                  transform: 'scale(1.1) rotate(10deg)',
                  boxShadow: '0 15px 30px rgba(99, 102, 241, 0.5)',
                },
                '& h3': {
                  color: '#6366f1',
                },
              }}
            >
              <Box
                className="service-icon"
                w="90px"
                h="90px"
                bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb="25px"
                fontSize="2.5rem"
                color="white"
                boxShadow="0 10px 20px rgba(99, 102, 241, 0.3)"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              >
                <Icon as={FaGift} />
              </Box>
              <Heading
                as="h3"
                fontSize="1.5rem"
                mb="20px"
                color="gray.900"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              >
                Subscription Plans
              </Heading>
              <Text color="gray.600" fontWeight="500">
                Flexible plans for continuous learning
              </Text>
            </Box>

            {/* Service Card 4 */}
            <Box
              bg="white"
              borderRadius="16px"
              p="40px 30px"
              textAlign="center"
              boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              position="relative"
              overflow="hidden"
              zIndex={1}
              sx={{ animation: 'fadeInUp 0.6s ease 0.3s both' }}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '0',
                bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: -1,
                opacity: 0.1,
              }}
              _hover={{
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                _before: {
                  height: '100%',
                },
                '& .service-icon': {
                  transform: 'scale(1.1) rotate(10deg)',
                  boxShadow: '0 15px 30px rgba(99, 102, 241, 0.5)',
                },
                '& h3': {
                  color: '#6366f1',
                },
              }}
            >
              <Box
                className="service-icon"
                w="90px"
                h="90px"
                bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb="25px"
                fontSize="2.5rem"
                color="white"
                boxShadow="0 10px 20px rgba(99, 102, 241, 0.3)"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              >
                <Icon as={FaHeadset} />
              </Box>
              <Heading
                as="h3"
                fontSize="1.5rem"
                mb="20px"
                color="gray.900"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              >
                Customer Support
              </Heading>
              <Text color="gray.600" fontWeight="500">
                24/7 assistance for your queries
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
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

      {/* Subscription Section */}
      <Box
        id="subscription"
        bgGradient="linear(135deg, #f0f4ff 0%, #e6f7ff 100%)"
        py="20"
        position="relative"
        overflow="hidden"
      >
        <Container maxW="900px" position="relative" zIndex={1}>
          <Box textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="800"
              mb="5"
              color="gray.900"
              sx={{ animation: 'fadeInUp 0.8s ease' }}
            >
              Choose Your Subscription
            </Heading>
            <Text
              fontSize="xl"
              color="gray.600"
              mb="50px"
              fontWeight="500"
              sx={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}
            >
              Get access to premium content and exclusive benefits
            </Text>

            <Box
              display="flex"
              justifyContent="center"
              gap="40px"
              flexWrap="wrap"
            >
              {/* Quarterly Plan */}
              <Box
                bg="white"
                borderRadius="16px"
                p="40px 30px"
                w="320px"
                boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                position="relative"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                overflow="hidden"
                sx={{ animation: 'fadeIn 0.6s ease' }}
                _hover={{
                  transform: 'translateY(-15px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <Heading as="h3" fontSize="1.8rem" mb="25px" color="gray.900">
                  Quarterly
                </Heading>
                <Box mb="25px">
                  <Text
                    as="span"
                    fontSize="3rem"
                    fontWeight="800"
                    bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                    bgClip="text"
                  >
                    ₹500
                  </Text>
                  <Text as="span" fontSize="1.1rem" color="gray.600" fontWeight="500">
                    /3 months
                  </Text>
                </Box>
                <List spacing="0" mb="35px" textAlign="left">
                  <ListItem
                    py="12px"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    fontWeight="500"
                    _before={{
                      content: '"✓"',
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Access to all books
                  </ListItem>
                  <ListItem
                    py="12px"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    fontWeight="500"
                    _before={{
                      content: '"✓"',
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Flipbook content
                  </ListItem>
                  <ListItem
                    py="12px"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    fontWeight="500"
                    _before={{
                      content: '"✓"',
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Video tutorials
                  </ListItem>
                  <ListItem
                    py="12px"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    fontWeight="500"
                    _before={{
                      content: '"✓"',
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Email support
                  </ListItem>
                </List>
                <Button
                  w="100%"
                  py="16px"
                  h="auto"
                  fontSize="1.1rem"
                  bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                  color="white"
                  borderRadius="16px"
                  fontWeight="600"
                  boxShadow="0 5px 15px rgba(99, 102, 241, 0.4)"
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.6)',
                  }}
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                >
                  Subscribe Now
                </Button>
              </Box>

              {/* Yearly Plan - Featured */}
              <Box
                bg="white"
                borderRadius="16px"
                p="40px 30px"
                w="320px"
                border="2px solid"
                borderColor="#6366f1"
                boxShadow="0 20px 40px rgba(99, 102, 241, 0.3)"
                position="relative"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                overflow="hidden"
                transform="scale(1.05)"
                zIndex={2}
                sx={{ animation: 'fadeIn 0.6s ease 0.2s both' }}
                _hover={{
                  transform: 'scale(1.05) translateY(-15px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <Box
                  position="absolute"
                  top="5px"
                  right="25px"
                  bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                  color="white"
                  px="20px"
                  py="8px"
                  borderRadius="20px"
                  fontSize="0.9rem"
                  fontWeight="700"
                  boxShadow="0 5px 15px rgba(0, 0, 0, 0.2)"
                  sx={{ animation: 'bounce 2s infinite' }}
                >
                  Popular
                </Box>
                <Heading as="h3" fontSize="1.8rem" mb="25px" color="gray.900">
                  Yearly
                </Heading>
                <Box mb="25px">
                  <Text
                    as="span"
                    fontSize="3rem"
                    fontWeight="800"
                    bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                    bgClip="text"
                  >
                    ₹2000
                  </Text>
                  <Text as="span" fontSize="1.1rem" color="gray.600" fontWeight="500">
                    /year
                  </Text>
                </Box>
                <List spacing="0" mb="35px" textAlign="left">
                  <ListItem
                    py="12px"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    fontWeight="500"
                    _before={{
                      content: '"✓"',
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Everything in Quarterly
                  </ListItem>
                  <ListItem
                    py="12px"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    fontWeight="500"
                    _before={{
                      content: '"✓"',
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Priority support
                  </ListItem>
                  <ListItem
                    py="12px"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    fontWeight="500"
                    _before={{
                      content: '"✓"',
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Exclusive content
                  </ListItem>
                  <ListItem
                    py="12px"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    fontWeight="500"
                    _before={{
                      content: '"✓"',
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    Early access to new books
                  </ListItem>
                </List>
                <Button
                  w="100%"
                  py="16px"
                  h="auto"
                  fontSize="1.1rem"
                  bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                  color="white"
                  borderRadius="16px"
                  fontWeight="600"
                  boxShadow="0 5px 15px rgba(99, 102, 241, 0.4)"
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.6)',
                  }}
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                >
                  Subscribe Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" bg="white" py="20">
        <Container maxW="7xl">
          <Box textAlign="center" mb="60px" position="relative">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="800"
              mb="4"
              color="gray.900"
              position="relative"
              display="inline-block"
              sx={{ animation: 'fadeInUp 0.8s ease' }}
              _after={{
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                borderRadius: '2px',
              }}
            >
              Contact Us
            </Heading>
            <Text
              fontSize="xl"
              color="gray.600"
              maxW="600px"
              mx="auto"
              mt="8"
              fontWeight="500"
              sx={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}
            >
              Get in touch with our team
            </Text>
          </Box>

          <Box
            display="flex"
            gap="60px"
            flexWrap="wrap"
          >
            {/* Contact Info */}
            <Box flex="1" minW="300px">
              {/* Phone */}
              <Box display="flex" gap="25px" mb="40px" alignItems="flex-start">
                <Box
                  fontSize="1.8rem"
                  color="#6366f1"
                  w="60px"
                  h="60px"
                  bgGradient="linear(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  _hover={{
                    transform: 'scale(1.1)',
                    bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                  }}
                >
                  <Icon as={FaPhone} />
                </Box>
                <Box>
                  <Heading as="h4" mb="8px" color="gray.900" fontSize="1.3rem">
                    Phone
                  </Heading>
                  <Text color="gray.600" fontWeight="500">
                    +91 91760 08087
                  </Text>
                </Box>
              </Box>

              {/* Email */}
              <Box display="flex" gap="25px" mb="40px" alignItems="flex-start">
                <Box
                  fontSize="1.8rem"
                  color="#6366f1"
                  w="60px"
                  h="60px"
                  bgGradient="linear(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  _hover={{
                    transform: 'scale(1.1)',
                    bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                  }}
                >
                  <Icon as={FaEnvelope} />
                </Box>
                <Box>
                  <Heading as="h4" mb="8px" color="gray.900" fontSize="1.3rem">
                    Email
                  </Heading>
                  <Text color="gray.600" fontWeight="500">
                    singglebee.rsventures@gmail.com
                  </Text>
                </Box>
              </Box>

              {/* Address */}
              <Box display="flex" gap="25px" mb="40px" alignItems="flex-start">
                <Box
                  fontSize="1.8rem"
                  color="#6366f1"
                  w="60px"
                  h="60px"
                  bgGradient="linear(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  _hover={{
                    transform: 'scale(1.1)',
                    bgGradient: 'linear(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                  }}
                >
                  <Icon as={FaMapMarkerAlt} />
                </Box>
                <Box>
                  <Heading as="h4" mb="8px" color="gray.900" fontSize="1.3rem">
                    Address
                  </Heading>
                  <Text color="gray.600" fontWeight="500">
                    Chennai, Tamil Nadu, India
                  </Text>
                </Box>
              </Box>

              {/* Social Media Links */}
              <Box>
                <Heading as="h4" mb="20px" color="gray.900" fontSize="1.3rem">
                  Follow Us
                </Heading>
                <HStack spacing="15px">
                  <Box
                    as="a"
                    href="https://instagram.com/singglebee"
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="1.8rem"
                    color="#6366f1"
                    w="60px"
                    h="60px"
                    bgGradient="linear(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    _hover={{
                      transform: 'scale(1.1)',
                      bgGradient: 'linear(135deg, #E1306C, #C13584)',
                      color: 'white',
                    }}
                  >
                    <Icon as={FaInstagram} />
                  </Box>
                  
                  <Box
                    as="a"
                    href="https://facebook.com/singglebee"
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="1.8rem"
                    color="#6366f1"
                    w="60px"
                    h="60px"
                    bgGradient="linear(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    _hover={{
                      transform: 'scale(1.1)',
                      bgGradient: 'linear(135deg, #1877F2, #0C63D4)',
                      color: 'white',
                    }}
                  >
                    <Icon as={FaFacebook} />
                  </Box>
                  
                  <Box
                    as="a"
                    href="https://twitter.com/singglebee"
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="1.8rem"
                    color="#6366f1"
                    w="60px"
                    h="60px"
                    bgGradient="linear(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    _hover={{
                      transform: 'scale(1.1)',
                      bgGradient: 'linear(135deg, #1DA1F2, #0C85D0)',
                      color: 'white',
                    }}
                  >
                    <Icon as={FaTwitter} />
                  </Box>
                </HStack>
              </Box>
            </Box>

            {/* Contact Form */}
            <Box as="form" flex="1" minW="300px">
              <VStack spacing="25px">
                <Input
                  placeholder="Your Name"
                  required
                  w="100%"
                  p="16px 20px"
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="16px"
                  fontSize="1rem"
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  _focus={{
                    outline: 'none',
                    borderColor: '#6366f1',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)',
                  }}
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  required
                  w="100%"
                  p="16px 20px"
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="16px"
                  fontSize="1rem"
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  _focus={{
                    outline: 'none',
                    borderColor: '#6366f1',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)',
                  }}
                />
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  required
                  w="100%"
                  p="16px 20px"
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="16px"
                  fontSize="1rem"
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  _focus={{
                    outline: 'none',
                    borderColor: '#6366f1',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)',
                  }}
                />
                <Button
                  type="submit"
                  w="100%"
                  py="16px"
                  h="auto"
                  fontSize="1.1rem"
                  bgGradient="linear(135deg, #6366f1, #8b5cf6)"
                  color="white"
                  borderRadius="16px"
                  fontWeight="600"
                  boxShadow="0 5px 15px rgba(99, 102, 241, 0.4)"
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.6)',
                  }}
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                >
                  Send Message
                </Button>
              </VStack>
            </Box>
          </Box>
        </Container>
      </Box>
      </Box>
    </>
  )
}