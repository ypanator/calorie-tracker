import { 
    HStack, 
    VStack, 
    Text, 
    List, 
    ListItem, 
    Button, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react";
import AddItemForm from "../components/AddItemForm.tsx";
import LabeledText from "../components/LabeledText.tsx";
import { useEffect, useState } from "react";
import { useToastHelper } from "../hooks/useToastHelper.tsx";
import useRequestHelper from "../hooks/useRequestHelper.tsx";

type UserProfile = {
    gender: "male" | "female";
    age: number;
    height: number;
    weight: number;
    bmi: string;
    calories: string;
    carbs: string;
    fiber: string;
    protein: string;
    fat: string;
    exercises: Array<{
        name: string;
        time: number;
        calories: number;
    }>;
    foods: Array<{
        name: string;
        count: number;
        unit: string;
        calories: number;
    }>;
}

export default function UserPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const { errorToast } = useToastHelper();
    const apiCall = useRequestHelper();

    const loadProfile = async () => {
        const endpoint = "/user/profile";
        try {
            const response = await apiCall("get", endpoint, {}, "Profile loaded successfully!");
            setProfile(response.data.data.user);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleUpdateProfile = async (input: Record<string, string>) => {
        const age = parseInt(input["Age"]);
        const height = parseInt(input["Height"]);
        const weight = parseInt(input["Weight"]);
        const gender = input["Gender"].toLowerCase();

        if (isNaN(age) || age <= 0 || age > 100) {
            errorToast("Age must be between 1 and 100.");
            return;
        }

        if (isNaN(height) || height < 120 || height > 250) {
            errorToast("Height must be between 120 and 250 cm.");
            return;
        }

        if (isNaN(weight) || weight < 30 || weight > 300) {
            errorToast("Weight must be between 30 and 300 kg.");
            return;
        }

        if (gender !== "male" && gender !== "female") {
            errorToast("Gender must be either 'male' or 'female'.");
            return;
        }

        const endpoint = "/user/set-attr";
        const payload = { gender, age, height, weight };

        try {
            await apiCall("post", endpoint, payload, "Profile updated successfully!");
            await loadProfile();
        } catch (err) {
            console.error(err);
        }
    };

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <VStack spacing={8} p={4} align="flex-start">
            <HStack w="100%" maxW="800px" justify="space-between">
                <Text fontSize="2xl" fontWeight="bold">Profile</Text>
                <Button colorScheme="black" onClick={onOpen}>Update Profile</Button>
            </HStack>
            
            <VStack align="flex-start" spacing={4} 
                borderWidth={2} 
                borderRadius="md" 
                p={4} 
                w="100%"
                maxW="800px"
            >
                <Text fontSize="2xl" fontWeight="bold">Current Profile</Text>
                {profile && (
                    <>
                        <HStack spacing={12} alignItems="flex-start">
                            <VStack align="flex-start">
                                <Text fontWeight="semibold">Personal Information</Text>
                                <LabeledText label="Gender" text={profile.gender} />
                                <LabeledText label="Age" text={profile.age.toString()} />
                                <LabeledText label="Height" text={`${profile.height} cm`} />
                                <LabeledText label="Weight" text={`${profile.weight} kg`} />
                                <LabeledText label="Last updated" text={new Date().toLocaleDateString()} />
                            </VStack>
                            <VStack align="flex-start">
                                <Text fontWeight="semibold">Nutrition Information</Text>
                                <LabeledText label="BMI" text={profile.bmi} />
                                <LabeledText label="Daily Calories" text={profile.calories} />
                                <LabeledText label="Carbohydrates" text={profile.carbs} />
                                <LabeledText label="Fiber" text={profile.fiber} />
                                <LabeledText label="Protein" text={profile.protein} />
                                <LabeledText label="Fat" text={profile.fat} />
                            </VStack>
                        </HStack>
                        <Text color="gray.500" fontSize="sm" mb={4}>
                            Statistics are calculated based on your profile information
                        </Text>
                        
                        <VStack align="flex-start" w="100%" spacing={4}>
                            <Text fontWeight="semibold">Exercise History</Text>
                            {profile.exercises.length > 0 ? (
                                <List w="100%">
                                    {profile.exercises.map((exercise, index) => (
                                        <ListItem key={index}>
                                            <HStack>
                                                <LabeledText label="Name" text={exercise.name} />
                                                <LabeledText label="Duration" text={`${exercise.time} minutes`} />
                                                <LabeledText label="Calories" text={exercise.calories.toString()} />
                                            </HStack>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Text color="gray.500">No exercises recorded yet</Text>
                            )}
                        </VStack>

                        <VStack align="flex-start" w="100%" spacing={4}>
                            <Text fontWeight="semibold">Food History</Text>
                            {profile.foods.length > 0 ? (
                                <List w="100%">
                                    {profile.foods.map((food, index) => (
                                        <ListItem key={index}>
                                            <HStack>
                                                <LabeledText label="Name" text={food.name} />
                                                <LabeledText label="Amount" text={`${food.count} ${food.unit}`} />
                                                <LabeledText label="Calories" text={food.calories.toString()} />
                                            </HStack>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Text color="gray.500">No foods recorded yet</Text>
                            )}
                        </VStack>
                    </>
                )}
                {!profile && (
                    <Text color="gray.500">Loading profile information...</Text>
                )}
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <AddItemForm
                            title="Update Profile Information"
                            labels={["Gender", "Age", "Height", "Weight"]}
                            onItemAdd={async (input) => {
                                await handleUpdateProfile(input);
                                onClose();
                            }}
                            placeholders={["male/female", "years", "cm", "kg"]}
                            minH="215px"
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
// Compare this snippet from frontend/src/pages/ExercisePage.tsx: