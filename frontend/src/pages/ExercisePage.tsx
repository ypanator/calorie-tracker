import { Button, HStack, List, ListItem, VStack } from "@chakra-ui/react";
import AddItemForm from "../components/AddItemForm.tsx";
import TextField from "../components/TextField.tsx";
import { useState } from "react";
import LabeledText from "../components/LabeledText.tsx";
import { useToastHelper } from "../hooks/useToastHelper.tsx";

type ExerciseSearchItem = {
    name: string;
    calories_per_hour: number;
    duration_minutes: number;
    total_calories: number;
}

type ExerciseAddItem = {
    name: string;
    time: number;
    calories: number;
}

export default function ExercisePage() {

    const [ searchBar, setSearchBar ] = useState("");
    const [ searchBarError, setSearchBarError ] = useState(false);
    const [ searchResult, setSearchResult ] = useState<ExerciseSearchItem[]>([]);
    const { errorToast } = useToastHelper();

    const addExercise = async (exercise: ExerciseAddItem) => { /* todo */ }
    
    const handleAddCustom = async (input: Record<string, string>) => {
        const name = input["Name"].trim();
        const time = parseInt(input["Duration"]);
        const calories = parseInt(input["Calories Burned"]);

        if (name.length === 0) {
            errorToast("Name cannot be empty.");
            return;
        }

        if (isNaN(time) || time <= 0) {
            errorToast("Invalid input for duration.");
            return;
        }

        if (isNaN(calories) || calories <= 0) {
            errorToast("Invalid input for calories.");
            return;
        }

        await addExercise({ name, time, calories });
    }

    const handleAddExercise = async (exercise: ExerciseSearchItem) => {
        await addExercise({
            name: exercise.name,
            time: exercise.duration_minutes,
            calories: exercise.total_calories
        });
    }

    const handleExerciseSearch = async (query: string) => {
        if (query.trim().length === 0) {
            errorToast("Search query cannot be empty.");
            return;
        }

        // todo: API call
        const data: ExerciseSearchItem[] = []

        setSearchResult(data);
    }

    return (
    <VStack>
        <AddItemForm 
            title="Add Custom Exercise"
            labels={["Name", "Duration", "Calories Burned"]}
            onItemAdd={async (input) => await handleAddCustom(input)}
            minH="215px"
        />
        <HStack>
            <TextField
                label="Search by name"
                errorMsg="Cannot be empty"
                isError={searchBarError}
                value={searchBar}
                onChange={(e) => {
                    setSearchBarError(e.target.value.trim().length === 0)
                    setSearchBar(e.target.value)
                }}
                w="auto"
                minW="500px"
                flexShrink={0}
            />
            <Button
            colorScheme="black"
            onClick={
                async () => await handleExerciseSearch(searchBar)
            }>Search</Button>
        </HStack>
        <List>
            {searchResult.map((exercise) => (
                <ListItem key={exercise.name + exercise.calories_per_hour}>
                    <HStack>
                        <LabeledText label="Name"               text={exercise.name} />
                        <LabeledText label="Calories per hour"  text={exercise.calories_per_hour.toString()} />
                        <LabeledText label="Duration"           text={exercise.duration_minutes.toString()} />
                        <LabeledText label="Total calories"     text={exercise.total_calories.toString()} />
                        <Button colorScheme="black" onClick={async () => {
                            await handleAddExercise(exercise);
                        }}>Add</Button>
                    </HStack>
                </ListItem>
            ))}
        </List>
    </VStack>
    );
}