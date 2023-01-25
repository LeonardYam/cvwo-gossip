import { Link, Outlet, useLocation } from "react-router-dom";
import Profile from "./Profile";
import LoginForm from "./LoginForm";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Layout = ({user} : {user: string | null}) => {
  const { pathname: url } = useLocation();
  const isNotHome = url !== '/' 

  return (
    <div>
      <div>
        <p>Gossip</p>
        {isNotHome && 
          <IconButton component={Link} to="/">
            <ArrowBackIcon/>
          </IconButton>}
        {user ? <Profile user={user} /> : <LoginForm />}
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
