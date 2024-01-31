import { Box, Button, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import AddNftModal from "src/components/AddNftModal"
import { useStateContext } from "../context";
import SingleNFToken from "../components/SingleNFToken";

const NFTokens = () => {
  const [open, setOpen] = useState();
  const [NFTokens, setNFTokens] = useState([]);
  const { getSellingNfts, userData } = useStateContext();

  useEffect(() => {
    fetchNFTokenData();
  }, [])

  const fetchNFTokenData = async () => {
    const res = await getSellingNfts();
    setNFTokens(res);
  }

  const handleClose = () => {
    setOpen(false);
  }
  return (
    <Box pt={9} px={8}>
      { open && <AddNftModal open={open} handleClose={handleClose}/> }
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="success" onClick={() => setOpen(true)}>
          Add NFT
        </Button>
      </Box>
      <Box display="grid" gridTemplateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={3} mt={2}>
        {NFTokens.map((token, i) => {
          return <SingleNFToken key={i} {...token} myNft={false} />
        })}
      </Box>
      { !NFTokens.length && <Typography>No NFTs for sale!</Typography> }
    </Box>
  )
}

export default NFTokens