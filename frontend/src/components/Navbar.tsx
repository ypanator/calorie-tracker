import { VStack, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { motion } from "framer-motion";

const MotionVStack = motion(VStack);

export default function Navbar({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
    <MotionVStack
        height="100%" zIndex={10}
        initial={false} 
        animate={{ width: collapsed ? "60px" : "250px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        spacing={4}
        p={4}
        align="flex-start"
        justify="flex-start"
        shadow="md"
        overflow="hidden"
    >
        <IconButton
            icon={collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle navbar"
            size="sm"
            position="absolute"
            top={4}
            left={4}
            zIndex={1}
        />
        {!collapsed && children}
    </MotionVStack>
    );
}
