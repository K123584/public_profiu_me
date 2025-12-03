import SignUpInputField from "../components/SignUpComponents/SignUpInputField";
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { securedAxios as axios } from '../axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuth, selectAuth } from '../store/authSlice';

const SignUp = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { username, status } = useAppSelector(selectAuth);

  useEffect(() => {
  if (status === 'idle') {
    dispatch(checkAuth());
    //すでにloginしている時
  } else if (status === 'succeeded' && username) {
    axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/auth`, {
      withCredentials: true,
    })
      .then(response => {
        if (response.data.loggedIn) {
          setLoggedIn(true);
          // CSRFトークンを取得
        //   axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/csrf`, {
        //     withCredentials: true
        //   })
        //   .then(res => {
        //     localStorage.setItem('csrf_token', res.data.csrf_token);
        //   });
            navigate('/edit', { replace: true });
        //loginしてない時
        } else {
          setLoggedIn(false);
        }
      })
      .catch(err => console.error(err));
  } else if (status === 'failed') {
    setLoggedIn(false);
  }
}, [navigate, status, username, dispatch]);

    return (
        <>
            {!loggedIn && <SignUpInputField />}
        </>
    )
}

export default SignUp;