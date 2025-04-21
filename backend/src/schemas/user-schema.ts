import { z } from "zod"

const userSchema = z.object({
    gender: z.enum(["male", "female"]).default("male"),
    age: z.number().min(1).max(100).default(30),
    height: z.number().min(120).max(250).default(170),
    weight: z.number().min(30).max(300).default(70)
});

export default userSchema;