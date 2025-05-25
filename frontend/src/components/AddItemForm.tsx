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
    errorMsg?: string;
}

type ValidationRule = {
    maxLength: number;
    pattern: RegExp;
    patternMsg: string;
    max?: number;
}

const VALIDATION_RULES: Record<string, ValidationRule> = {
    Name: {
        maxLength: 30,
        pattern: /^[a-zA-Z0-9\s\-]+$/,
        patternMsg: "Only letters, numbers, spaces and hyphens allowed"
    },
    Duration: {
        maxLength: 4,
        pattern: /^\d+$/,
        patternMsg: "Must be a number",
        max: 1440 // 24 hours in minutes
    },
    Amount: {
        maxLength: 4,
        pattern: /^\d+$/,
        patternMsg: "Must be a number",
        max: 9999
    },
    Unit: {
        maxLength: 15,
        pattern: /^[a-zA-Z\s]+$/,
        patternMsg: "Only letters and spaces allowed"
    },
    "Calories Burned": {
        maxLength: 5,
        pattern: /^\d+$/,
        patternMsg: "Must be a number",
        max: 99999
    },
    Calories: {
        maxLength: 5,
        pattern: /^\d+$/,
        patternMsg: "Must be a number",
        max: 99999
    }
};

export default function AddItemForm({ title, labels, onItemAdd, ...other }: AddItemFormProps & React.ComponentProps<typeof VStack>) {

    const [ values, setValues ] = useState<Record<string, TextFieldState>>(() =>
        Object.fromEntries(
            labels.map((label) => [label, {
                value: "",
                isError: false,
                errorMsg: "Cannot be empty"
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

    const validateField = (label: string, value: string): { isValid: boolean, errorMsg?: string } => {
        if (value.trim().length === 0) {
            return { isValid: false, errorMsg: "Cannot be empty" };
        }

        const rules = VALIDATION_RULES[label];
        if (!rules) return { isValid: true };

        if (value.length > rules.maxLength) {
            return { isValid: false, errorMsg: `Maximum ${rules.maxLength} characters` };
        }

        if (!rules.pattern.test(value)) {
            return { isValid: false, errorMsg: rules.patternMsg };
        }

        if (rules.max && parseInt(value) > rules.max) {
            return { isValid: false, errorMsg: `Maximum value is ${rules.max}` };
        }

        return { isValid: true };
    }

    const handleOnChange = (label: string, nextValue: string) => {
        const validation = validateField(label, nextValue);
        updateField(label, { 
            value: nextValue,
            isError: !validation.isValid,
            errorMsg: validation.errorMsg
        });
    }
    
    const handleAddItem = async () => {
        const input: Record<string, string> = {};
        let hasError = false;

        for (const [label, state] of Object.entries(values)) {
            const validation = validateField(label, state.value);
            if (!validation.isValid) {
                updateField(label, { isError: true, errorMsg: validation.errorMsg });
                hasError = true;
            }
        }

        if (hasError) return;

        for (const [key, value] of Object.entries(values)) {
            input[key] = value.value;
        }

        setFormState("submitting");
        await onItemAdd(input);
        setFormState("idle");

        // Clear form after successful submission
        setValues(prev => Object.fromEntries(
            Object.entries(prev).map(([key]) => [key, { value: "", isError: false, errorMsg: "Cannot be empty" }])
        ));
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
                    errorMsg={values[label].errorMsg}
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