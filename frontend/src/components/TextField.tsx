import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";

interface TextFieldProps {
  label: string;
  errorMsg: string;
  isError: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextField({ label, errorMsg, isError, value, onChange, ...other }: TextFieldProps & React.ComponentProps<typeof Input>) {
  return (
    <FormControl isInvalid={isError}>
      <FormLabel htmlFor={label}>{label}</FormLabel>
        <Input id={label} type="text" value={value} onChange={onChange} {...other}/>
      <FormErrorMessage>{errorMsg}</FormErrorMessage>
    </FormControl>
  );
}
