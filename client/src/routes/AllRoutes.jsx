import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router-dom"
import { Box } from '@mui/material'
import { PrivateRouter } from './PrivateRouter'
import { FTokens, Home, Login, NFTokens, Register } from 'src/pages'
import { Loader } from "../components"
import MyNFTokens from "../pages/MyNFTokens"
import { Approvals } from "../pages/Approvals"


export const AllRoutes = () => {
  return (    
    <Box>
        <Loader />
        <Toaster />
        <Routes>
            <Route path='/' element={<PrivateRouter><Home /></PrivateRouter> } />
            <Route path='/nfts' element={<PrivateRouter><NFTokens /></PrivateRouter> } />
            <Route path='/fts' element={<PrivateRouter><FTokens /></PrivateRouter> } />
            <Route path='/my-nfts' element={<PrivateRouter><MyNFTokens /></PrivateRouter> } />
            <Route path='/approvals' element={<PrivateRouter><Approvals /></PrivateRouter>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </Box>
  )
}
