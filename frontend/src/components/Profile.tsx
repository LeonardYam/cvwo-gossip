import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { logout } from '../reducers/auth';
import { useAppDispatch } from '../app/hooks';


const Profile = ({user} : {user: string}) => {
    const dispatch = useAppDispatch()
    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <Box>
            <Typography>{user}</Typography> 
            <Button onClick={handleLogout}>Logout</Button>
        </Box>
    )
}

export default Profile;
