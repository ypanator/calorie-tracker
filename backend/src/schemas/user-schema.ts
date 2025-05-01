import { z } from "zod";

const userSchema = z.object({
    gender: z.enum(["male", "female"]),
    age: z.number().min(1).max(100),
    height: z.number().min(120).max(250),
    weight: z.number().min(30).max(300)
});

export default userSchema;