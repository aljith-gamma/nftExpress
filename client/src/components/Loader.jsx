import { Backdrop, CircularProgress } from '@mui/material'
import { useStateContext } from '../context/index'

const Loader = () => {
    const { isLoading } = useStateContext();
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loader;