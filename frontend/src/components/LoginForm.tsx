import { useState } from "react"
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useCreateNewUserMutation, useLoginMutation } from "../reducers/api";
import { loginAuth } from "../reducers/auth";
import { useAppDispatch } from "../app/hooks";

const LoginForm = () => {
    const [dialog, setDialog] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState(false)
    const [loginUser, { isLoading: loginLoad }] = useLoginMutation()
    const [signUp, { isLoading: signupLoad }] = useCreateNewUserMutation()
    const dispatch = useAppDispatch()

    const handleUsernameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPassword(e.target.value)
    }

    const handleBackClick = () => {
        setDialog(false)
    }

    const handleOpenClick = () => {
        setDialog(true)
    }

    const handleLoginSubmit = async () => {
        try {
            const token = await loginUser({ Username: username, pw: password }).unwrap()
            dispatch(loginAuth(username, token))
        } catch (e) {
            console.error(e)
            setError(true)
        }
    }

    const handleSignUp = async () => {
        try {
            const token = await signUp({ Username: username, pw: password }).unwrap()
            dispatch(loginAuth(username, token))
        } catch (e) {
            console.error(e)
            setError(true)
        }
    }

    return (
        <Box>
            <Button name="openDialog" onClick={handleOpenClick}>
                Signup/Login
            </Button>
            <Dialog open={dialog}>
                <DialogTitle>Signup/Login</DialogTitle>
                <DialogContent>
                <TextField
                    margin="dense"
                    id="name"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={username}
                    onChange={handleUsernameChange}
                    error={error}
                    helperText={error &&"Please try again!"}
                />
                <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={handlePasswordChange}
                />
                </DialogContent>
                <DialogActions>
                <Button name="back" onClick={handleBackClick}>Back</Button>
                <LoadingButton name="signUp" onClick={handleSignUp} loading={signupLoad}>Sign up</LoadingButton>
                <LoadingButton name="loginUser" onClick={handleLoginSubmit} loading={loginLoad}>Sign in</LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    )
    
}

export default LoginForm