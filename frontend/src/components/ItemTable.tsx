import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"

interface props {
    headers: string[]
    data: Array<Record<string, any>>
}

export default function ItemTable({ headers, data }: props) {
    return (
    <TableContainer>
    <Table>
    
    <Thead>
    <Tr>
        {headers.map((h) => <Th key={h}>{h}</Th>)}
    </Tr>
    </Thead>

    <Tbody>
        {data.map((row, rowIdx) => 
            <Tr key={rowIdx}>
                {headers.map((h) => 
                    <Td key={h}>{row[h] ?? ""}</Td>)}
            </Tr>
        )}
    </Tbody>

    </Table>
    </TableContainer>
    )
}