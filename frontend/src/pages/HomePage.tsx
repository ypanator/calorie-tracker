import { VStack, Text, Box, HStack, Center } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function HomePage() {
    const MotionBox = motion(Box);

    return (
    <Center minW="100%" minH="100vh" bg="background.primary">
    <VStack spacing={8} p={8} align="flex-start" maxW="800px" mx="auto">
        <Text
            fontWeight="extrabold"
            fontSize="xxx-large"
            bgGradient="linear(to-r, teal.300, blue.400, purple.400, pink.300)"
            bgClip="text"
            backgroundSize="200% auto"
            animation="shine 3s ease-in-out infinite"
            sx={{
                "@keyframes shine": {
                    "0%": { backgroundPosition: "0% center" },
                    "100%": { backgroundPosition: "200% center" },
            },
        }}
        >
        Welcome to Calorie Tracker</Text>
        
        <Text color="whiteAlpha.800" fontSize="lg" maxW="600px">
            Track your daily nutrition and exercise to maintain a healthy lifestyle.
            Use the navigation menu to:
        </Text>

        <HStack spacing={8} w="100%" py={4}>
        <MotionBox
            p={6}
            bg="background.secondary"
            borderRadius="xl"
            flex={1}
            borderWidth="1px"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, rotate: -1, x: -6, y: -6 }}
            transition={{
            type: "spring",
            stiffness: 400,
            damping: 18,
            delay: 0.05,
            }}
        >
            <Text textStyle="h2" mb={2}>
                Track Exercise
            </Text>
            <Text color="whiteAlpha.800">
                Log your workouts and monitor your activity level
            </Text>
        </MotionBox>

        <MotionBox
            p={6}
            bg="background.secondary"
            borderRadius="xl"
            flex={1}
            borderWidth="1px"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, rotate: 1, x: 6, y: -6 }}
            transition={{
            type: "spring",
            stiffness: 400,
            damping: 18,
            delay: 0.15,
            }}
        >
            <Text textStyle="h2" mb={2}>
                Monitor Diet
            </Text>
            <Text color="whiteAlpha.800">
                Record your meals and track nutritional intake
            </Text>
        </MotionBox>
        </HStack>

    </VStack>
    </Center>
    );
}