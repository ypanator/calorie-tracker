import { FormControl, FormLabel, Input, FormErrorMessage, FormHelperText, InputProps } from "@chakra-ui/react";

interface TextFieldProps extends InputProps {
    label: string;
    errorMsg?: string;
    isError?: boolean;
    helperText?: string;
}

export default function TextField({ 
    label, 
    errorMsg, 
    isError, 
    helperText,
    ...props 
}: TextFieldProps) {
    return (
        <FormControl isInvalid={isError}>
            <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="whiteAlpha.900"
            >
                {label}
            </FormLabel>
            <Input
                variant="filled"
                bg="gray.700"
                borderWidth={1}
                borderColor={isError ? "brand.error" : "whiteAlpha.200"}
                _hover={{
                    bg: "background.elevated",
                    borderColor: isError ? "brand.error" : "whiteAlpha.400"
                }}
                _focus={{
                    bg: "background.elevated",
                    borderColor: isError ? "brand.error" : "brand.primary"
                }}
                transition="all 0.2s"
                {...props}
            />
            {isError ? (
                <FormErrorMessage fontSize="sm">{errorMsg}</FormErrorMessage>
            ) : helperText ? (
                <FormHelperText fontSize="sm">{helperText}</FormHelperText>
            ) : null}
        </FormControl>
    );
}
