import { VStack, Text, Box, HStack } from "@chakra-ui/react";

export default function HomePage() {
    return (
        <VStack spacing={8} p={8} align="flex-start" maxW="800px" mx="auto">
            <Text textStyle="h1">Welcome to Calorie Tracker</Text>
            
            <Text color="whiteAlpha.800" fontSize="lg" maxW="600px">
                Track your daily nutrition and exercise to maintain a healthy lifestyle.
                Use the navigation menu to:
            </Text>

            <HStack spacing={8} w="100%" py={4}>
                <Box 
                    p={6} 
                    bg="background.secondary" 
                    borderRadius="xl"
                    flex={1}
                    borderWidth="1px"
                    borderColor="whiteAlpha.100"
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="transform 0.2s"
                >
                    <Text textStyle="h2" mb={2}>Track Exercise</Text>
                    <Text color="whiteAlpha.800">Log your workouts and monitor your activity level</Text>
                </Box>
                <Box 
                    p={6} 
                    bg="background.secondary" 
                    borderRadius="xl"
                    flex={1}
                    borderWidth="1px"
                    borderColor="whiteAlpha.100"
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="transform 0.2s"
                >
                    <Text textStyle="h2" mb={2}>Monitor Diet</Text>
                    <Text color="whiteAlpha.800">Record your meals and track nutritional intake</Text>
                </Box>
            </HStack>
        </VStack>
    );
}