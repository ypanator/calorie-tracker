import { VStack, Text, HStack, Button } from "@chakra-ui/react";
import TextField from "./TextField.tsx";
import { useState } from "react";

type AddItemFormProps = {
    title: string;
    labels: string[];
    onSubmit: (input: Record<string, string>) => Promise<void>;
}

type TextFieldState = {
    value: string;
    isError: boolean;
}

export default function AddItemForm({ title, labels, onSubmit }: AddItemFormProps) {

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
    
    const handleSubmit = async () => {
        setFormState("submitting");
        const input: Record<string, string> = {};

        for (const entry of Object.entries(values)) {
            const [key, value] = entry;
            if (value.isError) {
                setFormState("idle");
                return;
            }
            input[key] = value.value;
        }
        
        await onSubmit(input);
        setFormState("idle");
    }

    return (
    <VStack spacing={4} align="stretch" width="max-content">
        <Text>{title}</Text>
        <HStack spacing={4} justify="space-evenly">
            {labels.map((label) => (
                <TextField
                    key={label}
                    label={label}
                    errorMsg="Cannot be empty."
                    isError={values[label].isError}
                    value={values[label].value}
                    onChange={(e) => {handleOnChange(label, e.target.value)}}
                />
            ))}
            <Button 
                onClick={() => handleSubmit()}
                isLoading={formState === "submitting"}    
            >Add</Button>
        </HStack>
    </VStack>
    )
}