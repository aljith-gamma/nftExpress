import { Box, Button, Typography } from '@mui/material'
import { useStateContext } from 'src/context';
import { Link } from 'react-router-dom';

const Login = () => {
  
  const { connectWallet } = useStateContext();

  const loginUser = (e) => {
    e.preventDefault();
    connectWallet();
  }

  return (
    <Box sx={{ 
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}>
        <Box width="25%" sx={{
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          padding: "25px 40px",
          borderRadius: "15px"
        }}>
            <Typography variant='h4' textAlign="center">Login</Typography>
            <Box> 
                <form onSubmit={loginUser}>
                  <Box display="flex" flexDirection="column" gap={3} py={4}>
                    <Button variant="contained" size="medium" type='submit'>
                      Connect Wallet
                    </Button>
                    <Link to="/register" style={{ textAlign: "right"}}>Don't have an account!</Link>
                  </Box>
                </form>
            </Box>
        </Box>
    </Box>
  )
}

export default Login;