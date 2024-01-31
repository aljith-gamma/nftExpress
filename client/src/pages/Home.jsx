import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useStateContext } from 'src/context'
import { CreditCard } from '../components/CreditCard';

// REACT_APP_CLOUDINARY_CLOUD_NAME="dcujap7df"
// REACT_APP_CLOUDINARY_API_KEY="353846769714977"
// REACT_APP_CLOUDINARY_API_SECRET="KpsPs366aMFBS5UYhl-0bjJCINs"
// REACT_APP_CLOUDINARY_UPLOAD_PRESET="efdbrqh3"

const Home = () => {
  const { userData, getTokenData} = useStateContext();
  
  useEffect(() => {
    getTokenData();
  }, [])

  return (
    <>
      <Box pt={8}>
        <Box display="flex" justifyContent="flex-end" p={1}>
          <Typography sx={{
            fontSize: "18px"
          }}>{ userData.name }</Typography>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="1fr 4fr" p={4}>
        <Box>
          <CreditCard />
        </Box>
        <Box>
          
        </Box>
      </Box>
    </>
  )
}

export default Home