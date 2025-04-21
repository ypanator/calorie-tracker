import { z } from "zod";

const authSchema = z.object({
    username: z.string().nonempty({ message: "Username cannot be empty." }),
    password: z.string().nonempty({ message: "Password cannot be empty." })
})

export default authSchema;

export type Auth = z.infer<typeof authSchema>;