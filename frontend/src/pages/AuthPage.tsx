import { Button, Center, HStack, VStack } from "@chakra-ui/react";
import TextField from "../components/TextField.tsx";
import { useState } from "react";
import { useToastHelper } from "../hooks/useToastHelper.tsx";
import axiosInstance from "../axios-instance.ts";
import { WorkWithMinDelay } from "../utils.tsx";


export default function AuthPage() {
    let [ username, setUsername ] = useState("");
    let [ usernameValid, setUsernameValid ] = useState(true);

    let [ password, setPassword ] = useState("");
    let [ passwordValid, setPasswordValid ] = useState(true);

    const [formState, setFormState] = useState<"idle" | "login" | "register">("idle");

    const { successToast, errorToast } = useToastHelper();

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
          const result = await WorkWithMinDelay(axiosInstance.post(endpoint, payload));
      
          if (result.status >= 400) {
            const msg = result.data.msg ?? result.data;
            errorToast(msg);
            console.error(msg);
          } else {
            const successMsg =
              action === "register"
                ? "Successfully registered! Please login."
                : "Successfully logged in!";
            successToast(successMsg);
          }
        } catch (err) {
          errorToast("Could not connect to server. Please try again later.");
          console.error(err);
        } finally {
          setFormState("idle");
        }
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
        <HStack padding={4} spacing={5}>
            <Button 
                onClick={() => handleAuth("login")} 
                isDisabled={formState === "register"} 
                isLoading={formState === "login"}
            >Login</Button>
            <Button 
                onClick={() => handleAuth("register")} 
                isDisabled={formState === "login"} 
                isLoading={formState === "register"}
            >Register</Button>
        </HStack>
    </VStack>
    </Center>
    );
}