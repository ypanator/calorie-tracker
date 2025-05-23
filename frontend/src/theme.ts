import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    primary: "#6B46C1",    // Purple for main actions
    secondary: "#38B2AC",  // Teal for food-related items
    accent: "#DD6B20",     // Orange for exercise-related items
    success: "#48BB78",    // Green for success states
    warning: "#ECC94B",    // Yellow for warnings
    error: "#F56565",      // Red for errors
  },
  background: {
    primary: "#1A202C",    // Dark blue-gray
    secondary: "#2D3748",  // Lighter blue-gray
    elevated: "#4A5568",   // For cards and elevated surfaces
  }
};

export default extendTheme({
  styles: {
    global: {
      body: {
        bg: "background.primary",
        color: "whiteAlpha.900",
      },
    },
  },
  colors,
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "lg",
        _hover: {
          transform: "translateY(-1px)",
          boxShadow: "lg",
        },
        transition: "all 0.2s",
      },
      variants: {
        solid: {
          bg: "brand.primary",
          color: "white",
          _hover: {
            bg: "brand.primary",
            opacity: 0.9,
          },
        },
        food: {
          bg: "brand.secondary",
          color: "white",
          _hover: {
            bg: "brand.secondary",
            opacity: 0.9,
          },
        },
        exercise: {
          bg: "brand.accent",
          color: "white",
          _hover: {
            bg: "brand.accent",
            opacity: 0.9,
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "background.secondary",
          borderRadius: "xl",
          boxShadow: "lg",
          transition: "all 0.2s",
          _hover: {
            transform: "translateY(-2px)",
            boxShadow: "xl",
          },
        },
      },
    },
    Form: {
      baseStyle: {
        helperText: {
          color: "whiteAlpha.700",
        },
        errorMessage: {
          color: "brand.error",
        },
      },
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  textStyles: {
    h1: {
      fontSize: ["2xl", "3xl"],
      fontWeight: "bold",
      lineHeight: "1.2",
      letterSpacing: "-0.01em",
    },
    h2: {
      fontSize: ["xl", "2xl"],
      fontWeight: "semibold",
      lineHeight: "1.2",
      letterSpacing: "-0.01em",
    },
    subtitle: {
      fontSize: "sm",
      fontWeight: "medium",
      color: "whiteAlpha.700",
    },
  },
});
