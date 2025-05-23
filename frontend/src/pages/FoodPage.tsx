import { Button, HStack, List, ListItem, VStack } from "@chakra-ui/react";
import AddItemForm from "../components/AddItemForm.tsx";
import TextField from "../components/TextField.tsx";
import { useState } from "react";
import LabeledText from "../components/LabeledText.tsx";
import { useToastHelper } from "../hooks/useToastHelper.tsx";
import useRequestHelper from "../hooks/useRequestHelper.tsx";

type FoodSearchItem = {
    name: string;
    calories: number;
    count: number;
    unit: string;
}

type FoodAddItem = {
    name: string;
    calories: number;
    count: number;
    unit: string;
}

export default function FoodPage() {
    const [searchBar, setSearchBar] = useState("");
    const [searchBarError, setSearchBarError] = useState(false);
    const [searchResult, setSearchResult] = useState<FoodSearchItem[]>([]);
    const { errorToast } = useToastHelper();
    const apiCall = useRequestHelper();

    const addFood = async (food: FoodAddItem) => {
        const endpoint = "/food/add";
        const payload = food;

        try {
            await apiCall("post", endpoint, payload, "Food item added successfully!");
        } catch (err) {
            console.error(err);
        }
    }
    
    const handleAddCustom = async (input: Record<string, string>) => {
        const name = input["Name"].trim();
        const count = parseInt(input["Amount"]);
        const calories = parseInt(input["Calories"]);
        const unit = input["Unit"].trim();

        if (name.length === 0) {
            errorToast("Name cannot be empty.");
            return;
        }

        if (isNaN(count) || count <= 0) {
            errorToast("Invalid input for amount.");
            return;
        }

        if (isNaN(calories) || calories <= 0) {
            errorToast("Invalid input for calories.");
            return;
        }

        if (unit.length === 0) {
            errorToast("Unit cannot be empty.");
            return;
        }

        await addFood({ name, calories, count, unit });
    }

    const handleAddFood = async (food: FoodSearchItem) => {
        await addFood({
            name: food.name,
            calories: food.calories,
            count: food.count,
            unit: food.unit
        });
    }

    const handleFoodSearch = async (query: string) => {
        if (query.trim().length === 0) {
            errorToast("Search query cannot be empty.");
            return;
        }

        const endpoint = "/food/find";
        const payload = { name: query, amount: 1 };

        try {
            const data = await apiCall("get", endpoint, payload, "Search completed successfully!");
            setSearchResult(data.data.data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
    <VStack>
        <AddItemForm 
            title="Add Custom Food"
            labels={["Name", "Amount", "Unit", "Calories"]}
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
                async () => await handleFoodSearch(searchBar)
            }>Search</Button>
        </HStack>
        <List>
            {searchResult.map((food) => (
                <ListItem key={food.name + food.calories}>
                    <HStack>
                        <LabeledText label="Name" text={food.name} />
                        <LabeledText label="Amount" text={food.count.toString()} />
                        <LabeledText label="Unit" text={food.unit} />
                        <LabeledText label="Calories" text={food.calories.toString()} />
                        <Button colorScheme="black" onClick={async () => {
                            await handleAddFood(food);
                        }}>Add</Button>
                    </HStack>
                </ListItem>
            ))}
        </List>
    </VStack>
    );
}