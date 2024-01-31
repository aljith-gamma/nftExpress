import { Navbar } from 'src/components';
import { useStateContext } from 'src/context'
import { Navigate } from 'react-router-dom';

export const PrivateRouter = ({ children }) => {
    const { userData } = useStateContext();
    if(userData.auth) {
        return (
            <>
                <Navbar />
                {children}
            </>
        )
    }
    return <Navigate to="/login" />
}