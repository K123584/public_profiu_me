import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { securedAxios as axios } from '../axios';
import EditComponet from '../components/HomeComponents/EditComponents/EditComponet';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuth, logout, selectAuth } from '../store/authSlice';

const Edit = () => {
  //
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { username, status} = useAppSelector(selectAuth);

  useEffect(() => {
    const check = async () => {
      if (status === 'idle') {
        dispatch(checkAuth());
      } else if (status === 'succeeded' && username) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/auth`, {
            withCredentials: true,
          });
          if (response.data.loggedIn) {
            setLoggedIn(true);
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/csrf`, {
              withCredentials: true
            });
            localStorage.setItem('csrf_token', res.data.csrf_token);
          } else {
            setLoggedIn(false);
            await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/logout`, {}, { withCredentials: true });
            dispatch(logout());
            localStorage.removeItem('csrf_token');
            navigate('/login', { replace: true });
          }
        } catch (err: any) {
          if (err.response && err.response.status === 404) {
            dispatch(logout());
            localStorage.removeItem('csrf_token');
            navigate('/login', { replace: true });
          } else {
            console.error(err);
          }
        }
      } else if (status === 'failed') {
        navigate('/login', { replace: true });
      }
    };
  check();
}, [navigate, status, username, dispatch]);

  return loggedIn ? (
    <>
        <EditComponet />
    </>
    
  )
   : null;

}


export default Edit