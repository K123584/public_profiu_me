import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { checkAuth, selectAuth } from '../../../store/authSlice';
import { securedAxios as axios } from '../../../axios';
import ArticleEditPage from './ArticleEditPage';

function ArticleEdit() {
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
            // console.log(response.data.loggedIn)
            if(response.data.loggedIn) {
              setLoggedIn(true);
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
  
    return loggedIn ? <ArticleEditPage /> : null;
}
export default ArticleEdit