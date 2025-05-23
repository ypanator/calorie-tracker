import { VStack, IconButton, useBreakpointValue, Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MotionVStack = motion(VStack);
const MotionBox = motion(Box);

export default function Navbar({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        // Auto-collapse on mobile
        if (isMobile) {
            setCollapsed(true);
        }
    }, [isMobile]);

    const childVariants = {
        expanded: { opacity: 1, x: 0 },
        collapsed: { opacity: 0, x: -10 }
    };

    return (
        <MotionVStack
            height="100vh"
            zIndex={10}
            initial={false} 
            animate={{ 
                width: collapsed ? "70px" : "220px",
                background: "background.secondary",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            spacing={7}
            p={4}
            align="stretch"
            justify="flex-start"
            shadow="dark-lg"
            overflow="hidden"
            whiteSpace="nowrap"
            borderRightWidth={2}
            borderRightColor="whiteAlpha.200"
        >
            <IconButton
                icon={collapsed ? <ChevronRightIcon boxSize={6} /> : <ChevronLeftIcon boxSize={6}/>}
                bg="gray.700"
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle navbar"
                variant="ghost"
                color="whiteAlpha.900"
                size="md"
                alignSelf="flex-end"
                _hover={{
                    bg: "whiteAlpha.100",
                    transform: "scale(1.1)",
                }}
                transition="all 0.2s"
            />
            <VStack spacing={5} align="stretch" flex={1}>
                <MotionVStack
                    initial="expanded"
                    animate={collapsed ? "collapsed" : "expanded"}
                    variants={childVariants}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </MotionVStack>
            </VStack>
        </MotionVStack>
    );
}
