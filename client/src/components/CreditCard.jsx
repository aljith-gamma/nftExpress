import { Box, Typography } from '@mui/material'
import Qr from '../assets/qr.png'
import Eth from '../assets/eth.png'
import Bg1 from '../assets/bg1.avif'
import { useStateContext } from '../context'

export const CreditCard = () => {
    const { userData: { account, name, balance } } = useStateContext();

    return (
        <Box width="350px" sx={{
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            padding: "30px",
            borderRadius: "16px",
            background: `url(${Bg1})`,
            backgroundSize: 'cover',
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight="600" color="gray">THE BLOCK CHAIN BANK</Typography>
            <Typography fontWeight="600" fontSize="18px" color="rgba(0, 0, 0, 0.7)">Sapolia</Typography>
            </Box>
            <Box my={1} sx={{
                borderRadius: "11px",
                overflow: "hidden",
                width: "45px",
                height: "42px"
            }}>
                <img src={Qr} alt="Qr" style={{ width: "100%", height: "100%"}}  />
            </Box>
            <Typography mb={1} mt={2} fontSize="14px" fontWeight="600">{ account || "0x XXXX XXXX XXXX XXXX XXXX" }</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Box>   
                    <Typography fontWeight="600" fontSize="18px" color="rgba(0, 0, 0, 0.7)">{ name }</Typography>
                    <Typography fontWeight="600" fontSize="18px" color="rgba(0, 0, 0, 0.5)" >Balance:&nbsp;
                        <span style={{
                            color: "#e07c10"
                        }}>
                            { balance }
                        </span>
                    </Typography>
                </Box>
                <Box sx={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    overflow: "hidden"
                }}>
                    <img src={Eth} alt="ethereum" style={{ width: "100%", height: "100%"}} />
                </Box>
            </Box>
        </Box>
    )
}
