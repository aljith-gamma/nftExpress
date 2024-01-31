import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useStateContext } from 'src/context';
import { Link } from 'react-router-dom';

export const Register = () => {
  const [name, setName] = useState('');
  
  const { connectWallet } = useStateContext();

  const handleChange = (e) => {
    const value = e.target.value;
    if(value.length > 15) return;
    setName(value);
  }

  const registerUser = (e) => {
    e.preventDefault();
    connectWallet(name);
    setName('');
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
            <Typography variant='h4' textAlign="center">Register</Typography>
            <Box> 
                <form onSubmit={registerUser}>
                  <Box display="flex" flexDirection="column" gap={3} py={4}>
                    <TextField
                      id="standard-multiline-flexible"
                      label="Name"
                      variant="standard"
                      sx={{
                        width: "100%"
                      }}
                      onChange={handleChange}
                      value={name}
                    />
                    <Button variant="contained" size="medium" type='submit' disabled={!name} >
                      Register
                    </Button>
                    <Link to="/login" style={{ textAlign: "right"}}>Already have an account!</Link>
                  </Box>
                </form>
            </Box>
        </Box>
    </Box>
  )
}

export default Register;