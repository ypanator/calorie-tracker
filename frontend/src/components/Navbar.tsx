import { VStack } from "@chakra-ui/react";

export default function Navbar({ children }: { children: React.ReactNode }) {
    return (
        <VStack spacing={4} top={0} left={0} bottom={0} shadow="md" width="max-content" align="start">
            {children}
        </VStack>
    );
}