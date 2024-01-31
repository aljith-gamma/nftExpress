import { Box, Button, Typography } from '@mui/material'
import { useStateContext } from '../context'
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { removeWallet } = useStateContext();
    const navigate = useNavigate();
    
    return (
        <nav>
            <Box display="flex" justifyContent="space-between" alignItems="center" zIndex={10}
                bgcolor="#2f2626" position="fixed" width="100%" py="15px"
            > 
                <Box pl="50px" >
                    <Typography variant='h5' fontWeight="600" sx={{ cursor: "pointer", color: "#FFF"}}
                        onClick={() => navigate('/')}
                    >
                        NFT Express
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={5} pr="50px" >
                    <NavLink to="/fts" className="active">FTs</NavLink>
                    <NavLink to="/nfts" className="active">NFTs</NavLink>
                    <NavLink to="/my-nfts" className="active">My NFTs</NavLink>
                    <NavLink to="/approvals" className="active">Approvals</NavLink>
                    <Button variant="contained" onClick={removeWallet}>Logout</Button> 
                </Box>
            </Box>
        </nav>
    )
}

export default Navbar;