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
import LabeledText from "../components/LabeledText.tsx";
import UserProfileForm from "../components/UserProfileForm.tsx";
import { useEffect, useState } from "react";
import useRequestHelper from "../hooks/useRequestHelper.tsx";
import { type UserProfile } from "../types/user-type";

export default function UserPage() {    const [profile, setProfile] = useState<UserProfile | null>(null);
    const apiCall = useRequestHelper();
    const { isOpen, onOpen, onClose } = useDisclosure();    const loadProfile = async () => {
        const endpoint = "/user/profile";
        try {
            const response = await apiCall("get", endpoint, {}, "Profile loaded successfully!");
            setProfile(response.user);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleUpdateProfile = async (values: {
        gender: string;
        age: string;
        height: string;
        weight: string;
    }) => {
        const payload = {
            gender: values.gender.toLowerCase(),
            age: parseInt(values.age),
            height: parseInt(values.height),
            weight: parseInt(values.weight)
        };

        const endpoint = "/user/set-attr";

        try {
            await apiCall("post", endpoint, payload, "Profile updated successfully!");
            await loadProfile();
            onClose();
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
                                <HStack w="100%" justify="space-between" align="center">
                                    <Text textStyle="h2">Exercise History</Text>
                                    {profile.exercises.length > 4 && (
                                        <Badge colorScheme="purple">{profile.exercises.length - 4} more</Badge>
                                    )}
                                </HStack>
                                {profile.exercises.length > 0 ? (
                                    <List w="100%" spacing={3}>
                                        {profile.exercises.slice(-4).reverse().map((exercise, index) => (
                                            <ListItem 
                                                key={index}
                                                p={4}
                                                bg="background.secondary"
                                                borderRadius="xl"
                                                boxShadow="sm"
                                                border="1px"
                                                borderColor="whiteAlpha.100"
                                                transition="all 0.2s"
                                                _hover={{ 
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "md",
                                                    borderColor: "whiteAlpha.200"
                                                }}
                                            >
                                                <HStack spacing={6}>
                                                    <LabeledText 
                                                        label="Activity" 
                                                        text={exercise.name.length > 15 ? `${exercise.name.slice(0, 15)}...` : exercise.name} 
                                                    />
                                                    <LabeledText 
                                                        label="Duration" 
                                                        text={`${exercise.time}`.length > 3 ? `${exercise.time}`.slice(0, 3) + '..m' : `${exercise.time}m`} 
                                                    />
                                                    <Badge colorScheme="orange" p={2} borderRadius="md">
                                                        {`${exercise.calories}`.length > 3 ? 
                                                            `${exercise.calories}`.slice(0, 3) + 'kcal' : 
                                                            `${exercise.calories}kcal`
                                                        }
                                                    </Badge>
                                                </HStack>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Text textStyle="subtitle">No exercises recorded yet</Text>
                                )}
                            </VStack>

                            <VStack align="flex-start" flex={1} bg="background.elevated" p={6} borderRadius="lg">
                                <HStack w="100%" justify="space-between" align="center">
                                    <Text textStyle="h2">Food History</Text>
                                    {profile.foods.length > 4 && (
                                        <Badge colorScheme="purple">{profile.foods.length - 4} more</Badge>
                                    )}
                                </HStack>
                                {profile.foods.length > 0 ? (
                                    <List w="100%" spacing={3}>
                                        {profile.foods.slice(-4).reverse().map((food, index) => (
                                            <ListItem 
                                                key={index}
                                                p={4}
                                                bg="background.secondary"
                                                borderRadius="xl"
                                                boxShadow="sm"
                                                border="1px"
                                                borderColor="whiteAlpha.100"
                                                transition="all 0.2s"
                                                _hover={{ 
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "md",
                                                    borderColor: "whiteAlpha.200"
                                                }}
                                            >
                                                <HStack spacing={6}>
                                                    <LabeledText 
                                                        label="Item" 
                                                        text={food.name.length > 15 ? `${food.name.slice(0, 15)}...` : food.name} 
                                                    />
                                                    <LabeledText 
                                                        label="Amount" 
                                                        text={`${food.count}`.length > 3 ? 
                                                            `${food.count}`.slice(0, 3) + `...${food.unit.slice(0, 1)}` :
                                                            `${food.count}${food.unit.slice(0, 1)}`
                                                        } 
                                                    />
                                                    <Badge colorScheme="teal" p={2} borderRadius="md">
                                                        {`${food.calories}`.length > 3 ? 
                                                            `${food.calories}`.slice(0, 3) + 'kcal' : 
                                                            `${food.calories}kcal`
                                                        }
                                                    </Badge>
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

            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent bg="background.secondary">
                    <ModalHeader>Update Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <UserProfileForm
                            onSubmit={handleUpdateProfile}
                            initialValues={profile || undefined}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
}