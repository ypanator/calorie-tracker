import { Button, Center, HStack, VStack } from "@chakra-ui/react";
import TextField from "../components/TextField.tsx";
import { useState } from "react";
import useRequestHelper from "../hooks/useRequestHelper.tsx";


export default function AuthPage() {
    let [ username, setUsername ] = useState("");
    let [ usernameValid, setUsernameValid ] = useState(true);

    let [ password, setPassword ] = useState("");
    let [ passwordValid, setPasswordValid ] = useState(true);

    const [formState, setFormState] = useState<"idle" | "login" | "register">("idle");

    const apiCall = useRequestHelper();

    const isValid = (str: string, type: "username" | "password"): boolean => {
        if (type === "username") {
            str = str.replace(/[^a-zA-Z0-9\s]/g, '');
        }
        return str.length > 0;
    }

    const validateData = (): boolean => {
        const usernameOK = isValid(username, "username");
        const passwordOK = isValid(password, "password");

        setUsernameValid(usernameOK);
        setPasswordValid(passwordOK);

        return usernameOK && passwordOK;
    }

    const handleUsernameChange = (nextUsername: string) => {
        setUsername(nextUsername);
        setUsernameValid(isValid(nextUsername, "username"));
    };

    const handlePasswordChange = (nextPassword: string) => {
        setPassword(nextPassword);
        setPasswordValid(isValid(nextPassword, "password"));
    };

    const handleAuth = async (action: "register" | "login") => {
        if (!validateData()) return;
      
        setFormState(action);
        const endpoint = `/auth/${action}`;
        const payload = { username, password };
      
        try {
            const successMsg =
              action === "register"
                ? "Successfully registered! Please login."
                : "Successfully logged in!";
            await apiCall("post", endpoint, payload, successMsg);

        } finally {
            setFormState("idle");
        }
      };
      
    return (
    <Center minWidth="100%" minHeight="100vh">
    <VStack
        borderWidth={2} 
        borderRadius="md" 
        boxShadow="dark-lg"
        padding={10}
        px={20}
      >
        <HStack align="flex-start" minH="100px">
        <TextField 
            label="username" errorMsg="Cannot be empty." isError={!usernameValid}
            value={username} onChange={(e) => handleUsernameChange(e.target.value)}/>
          </HStack>
        <HStack align="flex-start" minH="100px">
        <TextField 
            label="password" errorMsg="Cannot be empty." isError={!passwordValid}
            value={password} onChange={(e) => handlePasswordChange(e.target.value)}
            type="password" />
        </HStack>
        <HStack padding={2} pt={4} spacing={8}>
            <Button 
                onClick={() => handleAuth("login")} 
                isDisabled={formState !== "idle"}
                isLoading={formState === "login"}
                minW="90px"
            >Login</Button>
            <Button 
                onClick={() => handleAuth("register")} 
                isDisabled={formState !== "idle"}
                isLoading={formState === "register"}
            >Register</Button>
        </HStack>
    </VStack>
    </Center>
    );
}