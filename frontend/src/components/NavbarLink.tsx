import { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { HStack, Text } from "@chakra-ui/react";

export default function NavbarLink({ Icon, to, text }: { Icon: IconType, to: string, text: string }) {
    return (
        <HStack
            as={Link}
            to={to}
            spacing={4}
            p={2}
            borderRadius="md"
            _hover={{ bg: "whiteAlpha.100" }}
            overflow="hidden"
            whiteSpace="nowrap"
        >
            <Icon />
            <Text overflow="hidden" textOverflow="ellipsis">
                {text}
            </Text>
        </HStack>
    );
}