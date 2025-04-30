import { z } from "zod";

const foodSchema = z.object({
    name: z.string().nonempty(),
    calories: z.number().min(1),
    count: z.number().min(1),
    unit: z.string().min(1)
})

export default foodSchema;