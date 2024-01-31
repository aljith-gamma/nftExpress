import { Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { tokens } from 'src/config/tokens';

const SingleToken = ({ tokenId, name, symbol, totalSupply, price, usersOwned, available, getMyTokenCount, handleBuyOpen, handleSellOpen }) => {
    const [myTokenCount, setMyTokenCount] = useState(0);

    useEffect(() => {
        tokenCount();
    }, [])

    const tokenCount = async () => {
        try {
            const count = await getMyTokenCount(tokenId);
            setMyTokenCount(count);
        } catch (error) {
            console.log({ error })
        }
    }
    // console.log({ tokenId, name, symbol, totalSupply, price, usersOwned, available })
    const handleBuyModal = () => {
        handleBuyOpen(name, price, tokenId); 
    }

    const handleSellModal = () => {
        handleSellOpen(name, price, tokenId);
    }

    return (
        <Box display="flex" justifyContent="center">
            <Box bgcolor="#160F30"
                width="100%" p={4} borderRadius="20px"
            >
                <Box display="flex" alignItems="center" gap={3} >
                    <Box width="70px" height="70px" borderRadius="50%" overflow="hidden">
                        <img src={tokens[name]?.img} alt={name} style={{
                            width: "100%", height: "100%"
                        }} />
                    </Box>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography color="#e4e6eb" fontSize="20px">{ name }</Typography>
                            <Typography color="gray" fontSize="20px" fontWeight="600">{ symbol }</Typography>
                        </Box>
                        <Typography color="#fff" fontWeight={600} fontSize="19px">{price} ETH</Typography>
                    </Box>
                </Box>

                <Divider sx={{ border: "1px solid #fff", margin: "20px 0px 0px"}}  />

                <Box color="#FFF" px={1} mt={3} display="flex" flexDirection="column" gap={1} >
                    {/* <Box display="flex" gap={1} alignItems="center">
                        <Typography color="#e4e6eb" fontSize="18px">Capital</Typography>
                        <Box display="flex" gap={1}>
                            <Typography fontWeight="600" fontSize="18px">: { tokenDetails.capital } </Typography>
                            <Typography color="#e4e6eb" fontWeight="600" fontSize="18px">ETH</Typography>
                        </Box>
                    </Box> */}
                    <Box display="grid" gridTemplateColumns="1.5fr 2fr"  gap={1} alignItems="center">
                        <Typography color="#e4e6eb" fontSize="18px">Supply</Typography>
                        <Typography fontWeight="600" fontSize="18px">: { totalSupply } </Typography>
                    </Box>
                    <Box display="grid" gridTemplateColumns="1.5fr 2fr"  gap={1} alignItems="center">
                        <Typography color="#e4e6eb" fontSize="18px">Available </Typography>
                        <Typography fontWeight="600" fontSize="18px">: { available } </Typography>
                    </Box>
                    <Box display="grid" gridTemplateColumns="1.5fr 2fr"  gap={1} alignItems="center">
                        <Typography color="#e4e6eb" fontSize="18px">Owned by users </Typography>
                        <Typography fontWeight="600" fontSize="18px">: { usersOwned } </Typography>
                    </Box>
                    <Box display="grid" gridTemplateColumns="1.5fr 2fr"  gap={1} alignItems="center">
                        <Typography color="#e4e6eb" fontSize="18px">My tokens </Typography>
                        <Typography fontWeight="600" fontSize="18px">: { myTokenCount } </Typography>
                    </Box>
                </Box>

                <Box mt={6} px={3} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="success" onClick={handleBuyModal}>
                        Buy Tokens
                    </Button>
                    <Button variant="contained" color="error" onClick={handleSellModal}>
                        Sell Tokens
                    </Button>
                </Box>
            </Box>
        </Box>

    )
}

export default SingleToken