import { z } from "zod";

export const AuthSchema = z.object({
    username: z.string().nonempty({ message: "Username cannot be empty." }),
    password: z.string().nonempty({ message: "Password cannot be empty." })
})

export type Auth = z.infer<typeof AuthSchema>;