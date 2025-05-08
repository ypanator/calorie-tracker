import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";

interface TextFieldProps {
  label: string;
  errorMsg: string;
  isError: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextField({ label, errorMsg, isError, value, onChange }: TextFieldProps) {
  return (
    <FormControl isInvalid={isError} isRequired>
      <FormLabel htmlFor={label}>{label}</FormLabel>
        <Input id={label} type="text" value={value} onChange={onChange} />
      <FormErrorMessage>{errorMsg}</FormErrorMessage>
    </FormControl>
  );
}
