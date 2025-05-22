import { HStack, Text } from "@chakra-ui/react";

export default function LabeledText({ label, text }: { label: string; text: string }) {
    return (
        <HStack spacing={2} alignItems="flex-start">
            <Text fontWeight="light">{label}</Text>
            <Text>{text}</Text>
        </HStack>
    );
}