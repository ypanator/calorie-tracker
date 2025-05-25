import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"

interface props {
    headers: string[]
    data: Array<Record<string, any>>
}

export default function ItemTable({ headers, data }: props) {
    return (
    <TableContainer w="100%">
    <Table variant="unstyled" w="100%" size="lg">
    
    <Thead borderBottom="1px" borderColor="whiteAlpha.300">
    <Tr>
        {headers.map((h) => <Th key={h} py={4}>{h}</Th>)}
    </Tr>
    </Thead>

    <Tbody>
        {data.map((row, rowIdx) => 
            <Tr key={rowIdx} borderBottom="1px" borderColor="whiteAlpha.300">
                {headers.map((h) => 
                    <Td key={h} py={4}>{row[h] ?? ""}</Td>)}
            </Tr>
        )}
    </Tbody>

    </Table>
    </TableContainer>
    )
}