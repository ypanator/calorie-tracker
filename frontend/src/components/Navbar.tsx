import { VStack, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { motion } from "framer-motion";

const MotionVStack = motion(VStack);

export default function Navbar({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
    <MotionVStack
        height="100vh" zIndex={10}
        initial={false} 
        animate={{ width: collapsed ? "70px" : "220px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        spacing={5}
        p={4}
        align="center"
        justify="flex-start"
        shadow="dark-lg"
        boxShadow="0 0 30px 2px rgba(0, 0, 0, 0.9)"
        overflow="hidden"
        whiteSpace="nowrap"
    >
        <IconButton
            icon={collapsed ? <ChevronRightIcon boxSize={25} /> : <ChevronLeftIcon boxSize={25}/>}
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle navbar"
            size="md"
            alignSelf="flex-start"
            zIndex={1}
        />
            {!collapsed && children}
    </MotionVStack>
    );
}
