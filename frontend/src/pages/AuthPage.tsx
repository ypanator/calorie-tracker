import { Button, Center, HStack, VStack } from "@chakra-ui/react";
import TextField from "../components/TextField.tsx";
import { useState } from "react";

const MIN_SPINNER_MS = 1000;

export default function AuthPage() {
    let [ username, setUsername ] = useState("");
    let [ usernameValid, setUsernameValid ] = useState(true);

    let [ password, setPassword ] = useState("");
    let [ passwordValid, setPasswordValid ] = useState(true);

    const [formState, setFormState] = useState<"idle" | "login" | "register">("idle");

    const isValid = (str: string): boolean => {
        str = str.replace(/[^a-zA-Z\s]/g, '');
        return str.length > 0;
    }

    const validateData = (): boolean => {
        const userOK = isValid(username);
        const passOK = isValid(password);

        setUsernameValid(userOK);
        setPasswordValid(passOK);

        return userOK && passOK;
    }

    const withMinDelay = async <T,>(work: Promise<T>): Promise<T> => {
        const delay = new Promise((r) => setTimeout(r, MIN_SPINNER_MS));
        const result = await Promise.all([work, delay]);
        return result[0] as T;
    }

    const handleUsernameChange = (nextUsername: string) => {
        setUsername(nextUsername);
        setUsernameValid(isValid(nextUsername));
    };

    const handlePasswordChange = (nextPassword: string) => {
        setPassword(nextPassword);
        setPasswordValid(isValid(nextPassword));
    };

    const handleRegister = async () => {
        if (!validateData()) { return; }

        setFormState("register");
        
        const workPromise = Promise.resolve();
        await withMinDelay(workPromise);

        setFormState("idle");
    };

    const handleLogin = async () => {
        if (!validateData()) { return; }

        setFormState("login");
        
        const workPromise = Promise.resolve();
        await withMinDelay(workPromise);
        
        setFormState("idle");
    };

    return (
    <Center minWidth="100%" minHeight="100vh">
    <VStack>
        <TextField 
            label="username" errorMsg="Cannot be empty." isError={!usernameValid}
            value={username} onChange={(e) => handleUsernameChange(e.target.value)}/>
        <TextField 
            label="password" errorMsg="Cannot be empty." isError={!passwordValid}
            value={password} onChange={(e) => handlePasswordChange(e.target.value)}/>
        <HStack>
            <Button onClick={handleLogin} isDisabled={formState === "register"} isLoading={formState === "login"}>Login</Button>
            <Button onClick={handleRegister} isDisabled={formState === "login"} isLoading={formState === "register"}>Register</Button>
        </HStack>
    </VStack>
    </Center>
    );
}