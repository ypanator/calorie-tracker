import { z } from "zod";

const exerciseApiItemSchema = z.object({
  name: z.string(),
  calories_per_hour: z.number().int(),
  duration_minutes: z.number().int(),
  total_calories: z.number().int()
});

const exerciseApiSchema = z.array(exerciseApiItemSchema).max(10);
export default exerciseApiSchema;