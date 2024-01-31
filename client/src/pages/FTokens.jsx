import { Box } from "@mui/material"
import { useStateContext } from "src/context";
import { SingleToken } from "src/components";
import { BuyTokenModal } from "src/components/BuyTokenModal";
import { useState } from "react";
import { FTokenData } from "../components/FTokenData";

function FTokens() {
    const [buyOpen, setBuyOpen] = useState(false);
    const [sellOpen, setSellOpen] = useState(false);
    const [tokenDetails, setTokenDetails ] = useState({
        tokenId: 0,
        name: "",
        price: 0,
        type: ""
    });
    const { fTokens, getMyTokenCount } = useStateContext();

    const handleClose = () => {
        setBuyOpen(false);
        setSellOpen(false);
    }

    const handleBuyOpen = (tokenName, tokenPrice, tokenId) => {
        setTokenDetails({
            tokenId,
            name: tokenName,
            price: tokenPrice,
            type: "Buy"
        })
        setBuyOpen(true);
    }

    const handleSellOpen = (tokenName, tokenPrice, tokenId) => {
        setTokenDetails({
            tokenId,
            name: tokenName,
            price: tokenPrice,
            type: "Sell"
        })
        setSellOpen(true);
    }

    return (
        <Box>
            { buyOpen && <BuyTokenModal open={buyOpen} handleClose={handleClose} tokenDetails={tokenDetails}/> }
            { sellOpen && <BuyTokenModal open={sellOpen} handleClose={handleClose} tokenDetails={tokenDetails}/> }
            <Box  pt={8}>
                <Box py={4} px={8} display="grid" gridTemplateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={2}>
                    {fTokens.length && fTokens.map((token) => {
                        return <SingleToken key={token.tokenId} {...token} getMyTokenCount={getMyTokenCount} handleBuyOpen={handleBuyOpen} 
                            handleSellOpen={handleSellOpen}
                        />
                    })}
                </Box>
            </Box>

            <Box px={12} py={3} >
                <FTokenData />
            </Box>
        </Box>
    )
}

export default FTokens