import { z } from "zod";

export const ExerciseSchema = z.object({
    name: z.string().nonempty({ message: "Name cannot be empty." }),
    time: z.number().min(1, { message: "Time must be at least 1 minute." }),
    calories: z.number().min(1, { message: "Calories must be at least 1." })
});

export type Exercise = z.infer<typeof ExerciseSchema>