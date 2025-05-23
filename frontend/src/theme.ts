import { extendTheme } from "@chakra-ui/react";

export default extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.800", // brighter than 900
        color: "whiteAlpha.900",
      },
    },
  },
  colors: {
    brand: {
      50: "#f7fafc",
      900: "#2d3748",
    },
  },
  components: {
    Button: {
      baseStyle: {
        color: "white",
        bg: "gray.600",
        _hover: {
          bg: "gray.500",
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: "gray.700",
            _hover: {
              bg: "gray.700",
            },
            _focus: {
              bg: "gray.700",
            },
          },
        },
      },
    },
  },
  config: {
    initialColorMode: "white",
    useSystemColorMode: false,
  },
});