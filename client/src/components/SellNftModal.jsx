import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useStateContext } from 'src/context';

const SellNftModal = ({ handleClose, open, oldPrice, tokenId }) => {
    const [price, setPrice] = useState(0);

    const { sellNft } = useStateContext();
    
    const handleChange = (e) => {
        const value = Number(e.target.value);
        if(value < 0) return;
        setPrice(value);
    }

 
    const sellMyNft = async (e) => {
        e.preventDefault();
        if(price <= 0) {
            toast.error("Invalid price!");
            return;
        }
        await sellNft(tokenId, price);
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} >
            <Box mt={1}>
                <DialogTitle>Sell your NFT</DialogTitle>
                <form onSubmit={sellMyNft}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Price"
                                type="number"
                                variant="standard"
                                name="price"
                                value={price}
                                onChange={handleChange}
                                sx={{
                                    width: "400px"
                                }}
                                required
                            />
                            <Typography sx={{
                                color: "red",
                                fontSize: "14px"
                            }}>{ Number(oldPrice).toFixed(18) } ETH</Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box display="flex" gap={2} px={2} pb={2}>
                            <Button onClick={handleClose} variant='outlined' color='inherit' sx={{
                                width: "110px"
                            }}>Cancel</Button>
                            <Button type='submit' variant='contained' color='error' sx={{
                                width: "110px"
                            }}>Sell NFT</Button>
                        </Box>
                    </DialogActions>
                </form>
            </Box>
        </Dialog>
    )
}

export default SellNftModal