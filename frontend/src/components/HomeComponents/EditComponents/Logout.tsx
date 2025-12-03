import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { checkAuth, selectAuth } from "../../../store/authSlice";
import { logout } from "../../../store/authSlice";
import { securedAxios as axios } from '../../../axios';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function Logout() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { username, status } = useAppSelector(selectAuth);

    useEffect(() => {
      const check = async () => {
          if (status === 'idle') {
              dispatch(checkAuth());
          } else if (status === 'succeeded' && username) {
            axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/auth`,{
                withCredentials: true,
            })
            .then(response => {
                console.log(response.data)
                if(response.data.loggedIn) {
                    setLoggedIn(true);
                    console.log(`Username-debug!: ${username}`);
                } else {
                    setLoggedIn(false);
                    navigate('/login', { replace: true });
                }
            })
            .catch(err => console.error(err));
          } else if (status === 'failed') {
              await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/logout`, {}, { withCredentials: true });
              navigate('/login', { replace: true });
          }
        };
      check();
    }, [navigate, status, username, dispatch]);

    const handleLogout = async() => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
            if(response.status === 200) {
                console.log('submit success!');
                // Redux初期化
                dispatch(logout());
                localStorage.removeItem('csrf_token');
                navigate('/', { replace: true });
            } else {
                console.log('Failes to logout');
            }
            
        } catch(error) {
            console.log('Error:', error);
        }
    };

    return (
    <div>
        <Button 
            style={{backgroundColor: 'rgba(128, 128, 128, 0.2)'}}
            onClick={handleLogout}
            >
            ログアウト
        </Button>

    </div>
    )
}



export default Logout;