import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, tableCellClasses } from '@mui/material'
import { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { styled } from '@mui/material/styles';
import { tokens } from 'src/config/tokens';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export const Approvals = () => {
    const [data, setData] = useState([]);
    const { getMySellingFts, fTokens, acceptTransaction } = useStateContext();

    useEffect(() => {
        fetchApprovalList();
    }, [])

    const fetchApprovalList = async () => {
        let res = await getMySellingFts();
        res = res.filter((item) => item.isBuyer );
        setData(res);
    }

    return (
        <Box px={12} py={8}>
            <Box p={2} >
                <Typography variant="h4" color="#FFF">Approvals</Typography>
            </Box>
            
            { data[0] ? <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell width="5%" align="left">No.</StyledTableCell>
                        <StyledTableCell width="20%" align="left">Token</StyledTableCell>
                        <StyledTableCell width="15%" align="left">Symbol</StyledTableCell>
                        <StyledTableCell width="15%" align="left">Amount</StyledTableCell>
                        <StyledTableCell width="25%" align="left">Buyer</StyledTableCell>
                        <StyledTableCell width="10%" align="right"> </StyledTableCell>
                        <StyledTableCell width="10%" align="right"> </StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((row, i) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell align="left">{i+1}</StyledTableCell>
                            <StyledTableCell align="left">
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box width="30px" height="30px" borderRadius="50%" overflow="hidden">
                                        <img src={tokens[fTokens[row.tokenId]?.name]?.img} alt="coin" style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}/>    
                                    </Box>
                                    {fTokens[row.tokenId]?.name}
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell align="left">{fTokens[row.tokenId]?.symbol}</StyledTableCell>
                            <StyledTableCell align="left">{row.amount}</StyledTableCell>
                            <StyledTableCell align="left">{row.buyer}</StyledTableCell>
                            <StyledTableCell align="right">
                                <Button variant='contained' onClick={() => {
                                    acceptTransaction(row.id, true)
                                }}>
                                    Approve
                                </Button>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                <Button variant='contained' color='error' onClick={() => {
                                    acceptTransaction(row.id, false)
                                }}>
                                    Reject
                                </Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer> : <Typography textAlign="center">No Approval requests!</Typography> }
        </Box>
    )
}