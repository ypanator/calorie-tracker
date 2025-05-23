import { useState } from 'react';
import { Button, VStack, Text } from '@chakra-ui/react';
import TextField from './TextField';

interface AddItemFormProps {
    title: string;
    labels: string[];
    onItemAdd: (input: Record<string, string>) => Promise<void>;
    minH?: string;
    placeholders?: string[];
}

export default function AddItemForm({ 
    title, 
    labels, 
    onItemAdd, 
    minH = "auto",
    placeholders = [] 
}: AddItemFormProps) {
    const [inputs, setInputs] = useState<Record<string, string>>(
        Object.fromEntries(labels.map(label => [label, ""]))
    );
    const [errors, setErrors] = useState<Record<string, boolean>>(
        Object.fromEntries(labels.map(label => [label, false]))
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        const newErrors = { ...errors };
        let hasError = false;

        labels.forEach(label => {
            if (inputs[label].trim() === "") {
                newErrors[label] = true;
                hasError = true;
            }
        });

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            await onItemAdd(inputs);
            // Reset form after successful submission
            setInputs(Object.fromEntries(labels.map(label => [label, ""])));
            setErrors(Object.fromEntries(labels.map(label => [label, false])));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <VStack
            spacing={6}
            align="stretch"
            minH={minH}
            p={6}
            bg="background.elevated"
            borderRadius="xl"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
            boxShadow="lg"
            w="100%"
        >
            <Text textStyle="h2">{title}</Text>
            
            <VStack spacing={4} align="stretch">
                {labels.map((label, index) => (
                    <TextField
                        key={label}
                        label={label}
                        value={inputs[label]}
                        onChange={(e) => {
                            setInputs({ ...inputs, [label]: e.target.value });
                            setErrors({ ...errors, [label]: false });
                        }}
                        isError={errors[label]}
                        errorMsg={`${label} cannot be empty`}
                        placeholder={placeholders[index] || ""}
                    />
                ))}
            </VStack>

            <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                variant="solid"
                size="lg"
                mt={4}
                _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "lg",
                }}
                transition="all 0.2s"
            >
                Add {title}
            </Button>
        </VStack>
    );
}