import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, Box, Text } from "@chakra-ui/react"

interface props {
    headers: string[]
    data: Array<Record<string, any>>
}

export default function ItemTable({ headers, data }: props) {
    return (
    <Box 
        width="100%" 
        maxW="1200px"
        margin={6} 
        padding={6} 
        borderWidth={2} 
        borderRadius="md" 
        boxShadow="dark-lg"
    >
        <TableContainer>
        <Table size="lg" layout="fixed">
            <Thead>
            <Tr>
                {headers.map((h, i) => (
                    <Th 
                        key={h} 
                        py={4} 
                        borderRight={i < headers.length - 1 ? "1px" : "none"} 
                        borderColor="whiteAlpha.300"                        whiteSpace="normal"
                        wordBreak="break-word"
                        width={h === "Action" ? "150px" : "auto"}
                    >
                        {h}
                    </Th>
                ))}
            </Tr>
            </Thead>

            <Tbody>
                {data.map((row, rowIdx) => 
                    <Tr key={rowIdx}>
                        {headers.map((h, i) => 
                            <Td 
                                key={h} 
                                py={4}                                borderRight={i < headers.length - 1 ? "1px" : "none"} 
                                borderColor="whiteAlpha.300"
                                width={h === "Action" ? "150px" : "auto"}
                            >
                                {h === "Action" ? (
                                    <Box textAlign="center">
                                        {row[h]}
                                    </Box>
                                ) : (
                                    <Text 
                                        isTruncated
                                        title={row[h]?.toString() ?? ""}
                                    >
                                        {row[h] ?? ""}
                                    </Text>
                                )}
                            </Td>
                        )}
                    </Tr>
                )}
            </Tbody>
        </Table>
        </TableContainer>
    </Box>
    )
}