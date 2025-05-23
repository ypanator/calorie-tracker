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
    useDisclosure,
    Box,
    Divider,
    Badge
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import AddItemForm from "../components/AddItemForm.tsx";
import LabeledText from "../components/LabeledText.tsx";
import { useEffect, useState } from "react";
import { useToastHelper } from "../hooks/useToastHelper.tsx";
import useRequestHelper from "../hooks/useRequestHelper.tsx";
import { type UserProfile } from "../types/user-type";

export default function UserPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const { errorToast } = useToastHelper();
    const apiCall = useRequestHelper();
    const { isOpen, onOpen, onClose } = useDisclosure();

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

    return (
        <VStack spacing={8} p={6} align="flex-start" maxW="1200px" mx="auto">
            <HStack w="100%" justify="space-between" mb={2}>
                <Text textStyle="h1" color="whiteAlpha.900">Profile Dashboard</Text>
                <Button 
                    onClick={onOpen}
                    variant="solid"
                    leftIcon={<FaUser />}
                >
                    Update Profile
                </Button>
            </HStack>
            
            <Box 
                w="100%"
                bg="background.secondary"
                borderRadius="xl"
                p={6}
                boxShadow="xl"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
            >
                {profile ? (
                    <>
                        <HStack spacing={12} alignItems="flex-start">
                            <VStack align="flex-start" flex={1}>
                                <Text textStyle="h2" mb={4}>Personal Information</Text>
                                <HStack spacing={8} w="100%">
                                    <VStack align="flex-start" flex={1}>
                                        <LabeledText label="Gender" text={profile.gender} />
                                        <LabeledText label="Age" text={profile.age.toString()} />
                                    </VStack>
                                    <VStack align="flex-start" flex={1}>
                                        <LabeledText label="Height" text={`${profile.height} cm`} />
                                        <LabeledText label="Weight" text={`${profile.weight} kg`} />
                                    </VStack>
                                </HStack>
                                <Text textStyle="subtitle" mt={4}>
                                    Last updated: {new Date().toLocaleDateString()}
                                </Text>
                            </VStack>
                            
                            <Divider orientation="vertical" h="150px" />
                            
                            <VStack align="flex-start" flex={1}>
                                <Text textStyle="h2" mb={4}>Nutrition Stats</Text>
                                <HStack spacing={8} w="100%">
                                    <VStack align="flex-start" flex={1}>
                                        <Badge colorScheme="purple" mb={2}>Daily Goals</Badge>
                                        <LabeledText label="Calories" text={profile.calories} />
                                        <LabeledText label="Protein" text={profile.protein} />
                                    </VStack>
                                    <VStack align="flex-start" flex={1}>
                                        <Badge colorScheme="teal" mb={2}>Macros</Badge>
                                        <LabeledText label="Carbs" text={profile.carbs} />
                                        <LabeledText label="Fat" text={profile.fat} />
                                    </VStack>
                                </HStack>
                                <Text textStyle="subtitle" mt={4}>
                                    BMI: {profile.bmi}
                                </Text>
                            </VStack>
                        </HStack>

                        <Divider my={8} />

                        <HStack spacing={8} alignItems="flex-start">
                            <VStack align="flex-start" flex={1} bg="background.elevated" p={6} borderRadius="lg">
                                <Text textStyle="h2" mb={4}>Exercise History</Text>
                                {profile.exercises.length > 0 ? (
                                    <List w="100%" spacing={3}>
                                        {profile.exercises.map((exercise, index) => (
                                            <ListItem 
                                                key={index}
                                                p={3}
                                                bg="background.secondary"
                                                borderRadius="md"
                                                transition="all 0.2s"
                                                _hover={{ transform: "translateY(-2px)" }}
                                            >
                                                <HStack spacing={4}>
                                                    <LabeledText label="Activity" text={exercise.name} />
                                                    <LabeledText label="Duration" text={`${exercise.time} min`} />
                                                    <Badge colorScheme="orange">{exercise.calories} cal</Badge>
                                                </HStack>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Text textStyle="subtitle">No exercises recorded yet</Text>
                                )}
                            </VStack>

                            <VStack align="flex-start" flex={1} bg="background.elevated" p={6} borderRadius="lg">
                                <Text textStyle="h2" mb={4}>Food History</Text>
                                {profile.foods.length > 0 ? (
                                    <List w="100%" spacing={3}>
                                        {profile.foods.map((food, index) => (
                                            <ListItem 
                                                key={index}
                                                p={3}
                                                bg="background.secondary"
                                                borderRadius="md"
                                                transition="all 0.2s"
                                                _hover={{ transform: "translateY(-2px)" }}
                                            >
                                                <HStack spacing={4}>
                                                    <LabeledText label="Item" text={food.name} />
                                                    <LabeledText label="Amount" text={`${food.count} ${food.unit}`} />
                                                    <Badge colorScheme="teal">{food.calories} cal</Badge>
                                                </HStack>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Text textStyle="subtitle">No foods recorded yet</Text>
                                )}
                            </VStack>
                        </HStack>
                    </>
                ) : (
                    <VStack p={8} spacing={4}>
                        <Text textStyle="subtitle">Loading profile information...</Text>
                    </VStack>
                )}
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent bg="background.secondary">
                    <ModalHeader>Update Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <AddItemForm
                            title="Profile Information"
                            labels={["Gender", "Age", "Height", "Weight"]}
                            onItemAdd={handleUpdateProfile}
                            placeholders={["male/female", "years", "cm", "kg"]}
                            minH="215px"
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
}