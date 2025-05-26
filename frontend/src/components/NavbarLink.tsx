import { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";
import { HStack, Text } from "@chakra-ui/react";

type NavbarLinkProps = {
    Icon: IconType;
    to: string;
    text: string;
    onClick?: () => void;
};

export default function NavbarLink({ Icon, to, text, onClick }: NavbarLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (        <HStack
            as={Link}
            to={to}
            spacing={4}
            p={3}
            borderRadius="lg"
            bg={isActive ? "whiteAlpha.100" : "transparent"}
            color={isActive ? "white" : "whiteAlpha.800"}
            _hover={{ 
                bg: "whiteAlpha.200",
                transform: "translateX(2px)",
            }}
            transition="all 0.2s"
            overflow="hidden"
            whiteSpace="nowrap"
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <Icon style={{ 
                opacity: isActive ? 1 : 0.8,
                transition: "all 0.2s"
            }} />
            <Text 
                overflow="hidden" 
                textOverflow="ellipsis"
                fontWeight={isActive ? "600" : "400"}
            >
                {text}
            </Text>
        </HStack>
    );
}