export type UserProfile = {
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
};
