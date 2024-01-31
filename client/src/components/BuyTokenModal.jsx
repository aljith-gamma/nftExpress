import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useStateContext } from 'src/context';

export const BuyTokenModal = ({ open, handleClose, tokenDetails: { name, price, tokenId, type } }) => {
    const [amount, setAmount] = useState(0);
    const { buyTokens, sellFToken } = useStateContext();
    
    const handleChange = (e) => {
        const value = Number(e.target.value);
        if(value > 0){
            setAmount(value);
        }
    }

    const totalPrice = +price * amount;

    const handleBuyToken = async () => {
        const res = await buyTokens(tokenId, +amount, price);
        res && handleClose();
    }

    const handleSellToken = async () => {
        await sellFToken(tokenId, +amount);
        handleClose();
    }
    
    return (
        <Dialog open={open} onClose={handleClose} >
            <Box mt={1}>
                <DialogTitle>{ type } { name } Tokens</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Amount"
                            type="number"
                            variant="standard"
                            value={amount}
                            onChange={handleChange}
                            sx={{
                                width: "400px"
                            }}
                        />
                        <Typography color="red">{totalPrice.toFixed(18)} ETH</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box display="flex" gap={2} px={2} pb={2}>
                        <Button onClick={handleClose} variant='outlined' color='inherit' sx={{
                            width: "80px"
                        }}>Cancel</Button>
                        <Button onClick={type == 'Buy' ? handleBuyToken : handleSellToken } variant='contained' 
                            color={type == 'Buy' ? 'success' : 'error'} disabled={!amount} sx={{
                            width: "80px"
                        }}>{ type }</Button>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
