import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
    styles: {
        global: {
            body: {
                bg: "gray.900",
                color: "whiteAlpha.900",
            },
        },
    },
    colors: {
        brand: {
            50: "#ffffff",
            900: "#1a202c",
        },
    },
    components: {
        Button: {
            baseStyle: {
                color: "white",
                bg: "gray.700",
                _hover: {
                    bg: "gray.600",
                },
            },
        },
    },
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
});