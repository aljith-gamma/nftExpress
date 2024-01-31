import { Box, Button, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useStateContext } from "../context";
import SellNftModal from "./SellNftModal";

const SingleNFToken = ({ owner, price, timestamp, tokenId, uri, sell, myNft }) => {
    const [metaData, setMetaData] = useState({
        title: "", 
        description: "",
        uri: ""
    });
    const [open, setOpen] = useState(false);

    const { userData, cancelSellNft, buyNft} = useStateContext();

    useEffect(() =>{
        fetchUri();
    }, [])

    const fetchUri = async () => {
        try {
            let res = await fetch(uri);
            res = await res.json();
            setMetaData({ ...res });
        } catch (error) {
            console.log(error.message)
        }
    }

    const formatDate = (date) => {
        date = date * 1000;

        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        const formatedDate = new Date(date).toLocaleString('en-US', options);
        return formatedDate;
    }

    const handleClose = () => {
        setOpen(false);
    }

    const cancelNft = async () => {
        await cancelSellNft(tokenId);
    }

    const buyNfToken = async () => {
        await buyNft(tokenId, price);
    }

    return (
        <Box p={3} boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px" borderRadius="10px">
            { open && <SellNftModal open={open} handleClose={handleClose} oldPrice={price} tokenId={tokenId} />}
            <Box width="100%" height="230px" borderRadius="10px" overflow="hidden">
                <img src={metaData.uri} alt={metaData.title} style={{
                    width: "100%", height: "100%", objectFit: "cover"
                }} />
            </Box>
            <Box mt={2} display="flex" flexDirection="column" gap={1} >
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{
                        color: "gray",
                        width: "30%"
                    }}>Title</Typography>
                    <Typography sx={{ fontWeight: 600}}>: { metaData.title }</Typography>
                </Box>
                <Box display="flex"  gap={1}>
                    <Typography sx={{
                        color: "gray",
                        width: "30%"
                    }}>Description</Typography>
                    <Box width="68%" display="flex" gap={1}>
                        <Typography sx={{ fontWeight: 600}}>: </Typography>
                        <Box height="55px">
                            <Typography sx={{ fontWeight: 600}}>
                                { metaData.description.length > 50 ? metaData.description.slice(0, 50) + "..." : metaData.description }
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{
                        color: "gray",
                        width: "30%"
                    }}>Price</Typography>
                    <Typography sx={{ fontWeight: 600}}>: { Number(price).toFixed(18) }</Typography>
                    <Typography sx={{ fontWeight: 600}}>ETH</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{
                        color: "gray",
                        width: "30%"
                    }}>Date</Typography>
                    <Typography sx={{ fontWeight: 600}}>: { formatDate(timestamp) }</Typography>
                </Box>
            </Box>
            <Box mt={2} >
                { !myNft && owner.toLowerCase() !== userData.account && <Button variant="contained" 
                    color="success"
                    onClick={buyNfToken}
                    sx={{ width: "100%"}}
                >
                    Buy NFT
                </Button> }
                {!myNft && owner.toLowerCase() === userData.account && <Button variant="contained" 
                    color="error"
                    onClick={cancelNft}
                    sx={{ width: "100%"}}
                >
                    Cancel
                </Button>}

                { myNft && sell && <Button variant="contained" 
                    color="error"
                    onClick={cancelNft}
                    sx={{ width: "100%"}}
                >
                    Cancel
                </Button> }

                { myNft && !sell && <Button variant="contained" 
                    color="error"
                    onClick={() => setOpen(true)}
                    sx={{ width: "100%"}}
                >
                    Sell NFT
                </Button> }
            </Box>
        </Box>
    )
}

export default SingleNFToken