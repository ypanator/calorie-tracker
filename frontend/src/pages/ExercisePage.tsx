import { Button, HStack, List, VStack } from "@chakra-ui/react";
import AddItemForm from "../components/AddItemForm.tsx";
import TextField from "../components/TextField.tsx";
import { useState } from "react";

export default function ExerecisePage() {

    const [ searchBar, setSearchBar ] = useState("");

    const handleAddExercise = async (input) => {}

    return (
    <VStack>
        <AddItemForm 
            title="Add Custom Exercise"
            labels={["Name", "Duration", "Calories Burned"]}
            onSubmit={(input) => handleAddExercise(input)}
            minH="215px"
        />
        <HStack>
            <TextField
                label="Search by name"
                errorMsg="Cannot be empty"
                isError={searchBar.trim().length === 0}
                value={searchBar}
                onChange={(e) => setSearchBar(e.target.value)}
                w="auto"
                minW="500px"
                flexShrink={0}
            />
            <Button>Search</Button>
        </HStack>
        <List></List>
    </VStack>
    );

}