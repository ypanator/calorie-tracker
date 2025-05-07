import { useToast } from "@chakra-ui/react";

export const useToastHelper = () => {
  const toast = useToast();

  const successToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const errorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const infoToast = (message: string) => {
    toast({
      title: "Information",
      description: message,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return { successToast, errorToast, infoToast };
};
