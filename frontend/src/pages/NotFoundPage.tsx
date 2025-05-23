import { VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <VStack 
            spacing={6} 
            justify="center" 
            align="center" 
            minH="100vh" 
            p={8}
            bg="background.primary"
        >
            <Text textStyle="h1">404</Text>
            <Text fontSize="xl" color="whiteAlpha.800">Page not found</Text>
            <Button
                onClick={() => navigate("/")}
                variant="solid"
                size="lg"
                mt={4}
                _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                }}
                transition="all 0.2s"
            >
                Return Home
            </Button>
        </VStack>
    );
}