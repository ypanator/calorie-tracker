import { 
    VStack, 
    Button, 
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Select
} from "@chakra-ui/react";
import { useState } from "react";

interface UserProfileFormProps {
    onSubmit: (data: {
        gender: string;
        age: string;
        height: string;
        weight: string;
    }) => Promise<void>;
    initialValues?: {
        gender?: string;
        age?: number;
        height?: number;
        weight?: number;
    };
}

export default function UserProfileForm({ onSubmit, initialValues }: UserProfileFormProps) {
    const [formState, setFormState] = useState<"idle" | "submitting">("idle");
    const [values, setValues] = useState({
        gender: initialValues?.gender || "",
        age: initialValues?.age?.toString() || "",
        height: initialValues?.height?.toString() || "",
        weight: initialValues?.weight?.toString() || ""
    });
    const [errors, setErrors] = useState({
        gender: "",
        age: "",
        height: "",
        weight: ""
    });

    const validate = () => {
        const newErrors = {
            gender: "",
            age: "",
            height: "",
            weight: ""
        };

        if (!values.gender) {
            newErrors.gender = "Gender is required";
        } else if (!["male", "female"].includes(values.gender.toLowerCase())) {
            newErrors.gender = "Gender must be male or female";
        }

        const age = parseInt(values.age);
        if (!values.age) {
            newErrors.age = "Age is required";
        } else if (isNaN(age) || age <= 0 || age > 100) {
            newErrors.age = "Age must be between 1 and 100";
        }

        const height = parseInt(values.height);
        if (!values.height) {
            newErrors.height = "Height is required";
        } else if (isNaN(height) || height < 120 || height > 250) {
            newErrors.height = "Height must be between 120 and 250 cm";
        }

        const weight = parseInt(values.weight);
        if (!values.weight) {
            newErrors.weight = "Weight is required";
        } else if (isNaN(weight) || weight < 30 || weight > 300) {
            newErrors.weight = "Weight must be between 30 and 300 kg";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setFormState("submitting");
        try {
            await onSubmit(values);
        } finally {
            setFormState("idle");
        }
    };

    return (
        <VStack spacing={4} width="100%">
            <FormControl isInvalid={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <Select
                    value={values.gender}
                    onChange={e => setValues({...values, gender: e.target.value})}
                    placeholder="Select gender"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </Select>
                <FormErrorMessage>{errors.gender}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.age}>
                <FormLabel>Age</FormLabel>
                <Input
                    type="number"
                    value={values.age}
                    onChange={e => setValues({...values, age: e.target.value})}
                    placeholder="Enter age in years"
                />
                <FormErrorMessage>{errors.age}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.height}>
                <FormLabel>Height</FormLabel>
                <Input
                    type="number"
                    value={values.height}
                    onChange={e => setValues({...values, height: e.target.value})}
                    placeholder="Enter height in cm"
                />
                <FormErrorMessage>{errors.height}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.weight}>
                <FormLabel>Weight</FormLabel>
                <Input
                    type="number"
                    value={values.weight}
                    onChange={e => setValues({...values, weight: e.target.value})}
                    placeholder="Enter weight in kg"
                />
                <FormErrorMessage>{errors.weight}</FormErrorMessage>
            </FormControl>

            <Button
                onClick={handleSubmit}
                isLoading={formState === "submitting"}
                width="100%"
                mt={4}
            >
                Update Profile
            </Button>
        </VStack>
    );
}
