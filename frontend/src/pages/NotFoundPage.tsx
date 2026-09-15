
import React from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

const NotFoundPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="gray.50"
      px={4}
    >
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl" color="purple.600">
          404
        </Heading>
        <Text fontSize="xl" color="gray.700">
          Oops! The page you’re looking for doesn’t exist.
        </Text>
        <Text color="gray.500">
          It might have been moved or deleted. Let’s get you back on track.
        </Text>
        <Button
          as={Link}
          to="/"
          colorScheme="purple"
          size="lg"
          _hover={{ bg: "purple.700" }}
        >
          Go to Homepage
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFoundPage;
