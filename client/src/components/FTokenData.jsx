import { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, tableCellClasses } from '@mui/material'
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

export const FTokenData = () => {
    const [data, setData] = useState([]);
    const [myFts, setMyFts] = useState(false);
    const { getSellingFts, fTokens, userData, cancelSellFToken, getMySellingFts, buyTokenFromSeller } = useStateContext();

    useEffect(() => {
        fetchSellingFts();
    }, [myFts])

    const fetchSellingFts = async () => {
        let res;
        if(myFts) {
            res = await getMySellingFts();
            res = res.filter((item) => !item.isBuyer);
        }else {
            res = await getSellingFts();
        }
        setData(res);
        console.log({ res, fTokens, account: userData.account })
    }

    return (
        <Box>
            { data[0] ? <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell width="5%" align="left">No.</StyledTableCell>
                        <StyledTableCell width="20%" align="left">Token</StyledTableCell>
                        <StyledTableCell width="15%" align="left">Symbol</StyledTableCell>
                        <StyledTableCell width="15%" align="left">Amount</StyledTableCell>
                        <StyledTableCell width="15%" align="left">Seller</StyledTableCell>
                        <StyledTableCell width="15%" align="left">Account</StyledTableCell>
                        <StyledTableCell width="15%" align="right">
                            <Button variant="outlined" size="small" onClick={() => {
                                setMyFts(!myFts)
                            }}>
                                { myFts ? "My" : "All" } FTs
                            </Button>
                        </StyledTableCell>
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
                            <StyledTableCell align="left">{row.name}</StyledTableCell>
                            <StyledTableCell align="left">{row.owner}</StyledTableCell>
                            <StyledTableCell align="right">
                                { row.owner.toLowerCase() == userData.account.toLowerCase() ? ( <Button variant="contained" color="error" onClick={() => {
                                        cancelSellFToken(row.tokenId)
                                    }}
                                    sx={{
                                        width: "80%"
                                    }}>Cancel</Button> ) : (
                                    <Button variant="contained" color="success" onClick={() => {
                                        buyTokenFromSeller(row.owner, row.tokenId, row.amount);
                                    }} sx={{
                                        width: "80%"
                                    }}>Buy</Button>
                                ) }
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer> : <Typography textAlign="center">No FTs for sale!</Typography>}
        </Box>
    )
}
