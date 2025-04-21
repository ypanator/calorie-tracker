import { z } from "zod";

// messages might be redundant?
export const exerciseSchema = z.object({
    name: z.string().nonempty({ message: "Name cannot be empty." }),
    time: z.number().min(1, { message: "Time must be at least 1 minute." }),
    calories: z.number().min(1, { message: "Calories must be at least 1." })
});

export type Exercise = z.infer<typeof exerciseSchema>