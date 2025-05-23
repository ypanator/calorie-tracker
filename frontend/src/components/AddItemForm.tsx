import { VStack, Text, HStack, Button } from "@chakra-ui/react";
import TextField from "./TextField.tsx";
import { useState } from "react";

type AddItemFormProps = {
    title: string;
    labels: string[];
    onItemAdd: (input: Record<string, string>) => Promise<void>;
}

type TextFieldState = {
    value: string;
    isError: boolean;
}

export default function AddItemForm({ title, labels, onItemAdd, ...other }: AddItemFormProps & React.ComponentProps<typeof VStack>) {

    const [ values, setValues ] = useState<Record<string, TextFieldState>>(() =>
        Object.fromEntries(
            labels.map((label) => [label, {
                value: "",
                isError: false,
        }]))
    );

    const [ formState, setFormState ] = useState<"idle" | "submitting">("idle");

    const updateField = (key: string, partial: Partial<TextFieldState>) => {
        setValues((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...partial,
            }
        }));
    }

    const handleOnChange = (label: string, nextValue: string) => {
        updateField(label, { value: nextValue, isError: nextValue.trim().length === 0 })
    }
    
    const handleAddItem = async () => {
        const input: Record<string, string> = {};

        for (const entry of Object.entries(values)) {
            const [key, value] = entry;
            if (value.isError) { return; }
            input[key] = value.value;
        }

        setFormState("submitting");
        await onItemAdd(input);
        setFormState("idle");
    }

    return (
    <VStack 
        spacing={5} 
        align="stretch" 
        width="max-content" 
        margin={6} 
        padding={6} 
        borderWidth={2} 
        borderRadius="md" 
        boxShadow="dark-lg"
        {...other}
    >
        <Text as="b" fontSize="25px">{title}</Text>
        <HStack spacing={7} justify="space-evenly" align="flex-start">
            {labels.map((label) => (
                <TextField
                    key={label}
                    label={label}
                    errorMsg="Cannot be empty."
                    isError={values[label].isError}
                    value={values[label].value}
                    onChange={(e) => {handleOnChange(label, e.target.value)}}
                    maxW={170}
                />
            ))}
            <Button 
                onClick={() => handleAddItem()}
                isLoading={formState === "submitting"}
                px={6}
                mt={7}
            >Add</Button>
        </HStack>
    </VStack>
    )
}