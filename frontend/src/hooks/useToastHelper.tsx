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
      position: "bottom-right"
    });
  };

  const errorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-right"
    });
  };

  const infoToast = (message: string) => {
    toast({
      title: "Information",
      description: message,
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "bottom-right"
    });
  };

  return { successToast, errorToast, infoToast };
};
