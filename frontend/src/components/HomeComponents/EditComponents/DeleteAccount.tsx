import { Button } from "@mui/material";
import { checkAuth, logout, selectAuth } from "../../../store/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { securedAxios as axios } from '../../../axios';

function DeleteAccount() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { username, status } = useAppSelector(selectAuth);

    useEffect(() => {
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
          navigate('/login', { replace: true });
        }
      }, [navigate, status, username, dispatch]);

    const handleLogout = async() => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/deleteaccount`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            },
                
            );
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
            アカウントを削除
        </Button>

    </div>
    )
}

export default DeleteAccount;