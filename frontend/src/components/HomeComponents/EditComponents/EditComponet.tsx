import React, { ReactElement, useEffect, useState } from 'react';
import PreviewDefaultHeaderBox from '../PreviewComponents/PreviewDefaultHeaderBox';
import { Box, Button } from '@mui/material';
import { securedAxios as axios } from '../../../axios';
import PreviewColorPicker from '../PreviewComponents/PreviewColorPicker';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { checkAuth, selectAuth } from '../../../store/authSlice';
import CreateOptionItemEditorButton from '../PreviewComponents/PreviewsParts/CreateOptionItemEditorButton';
import ReadOptionContentList from '../../OptionItemEditors/UpdateOptionContentsEditor';
import { SyncLoader } from 'react-spinners';
import UserSettingIcon from './UserSettingIcon';
import PreviewNewsListBox from '../PreviewComponents/PreviewNewsListBox';
import { setBackground } from '../../../store/backgroundSlice';
import DisplayUrl from '../PreviewComponents/PreviewsParts/DisplayUrl';
import { logout } from '../../../store/authSlice';
import PublicUserPageDisplay from '../PreviewComponents/PreviewsParts/PublicUserPageDisplay';


interface User {
  id: number;
  username: string;
  main_profile_title: string;
  main_profile_text: string;
}

const EditComponent = (): ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  // const [background, setBackground] = useState<Background | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reduxBackgroundType = useAppSelector(state => state.background.background_type);
  const reduxHeaderBackgroundColor = useAppSelector(state => state.background.background_color);
  const reduxBackgroundImagePath = useAppSelector(state => state.background.background_image_path );
  const { isAuthenticated, username, status } = useAppSelector(selectAuth);

  const fstyle = {
    fontFamily: "DotGothic16, sans-serif"
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(checkAuth());
    } else if (status === 'succeeded' && username) {
      axios.get<User>(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}`, { withCredentials: true })
        .then(response => {
          setUser(response.data);
          return response.data.username;
        })
        .then(username => {
          console.log(`Fetching data for username: ${username}`); 
          axios.get<any>(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/backgroundget`, { withCredentials: true })
            .then(response => {
              dispatch(setBackground(response.data));
              // const backGroundImagePath = process.env.CLOUDFLARE_BG_IMG_URL + "/01_wave.jpg";
            })
            .catch(err => {
              setError(err.message);
              if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/logout`, {}, { withCredentials: true });
                localStorage.removeItem('csrf_token');
                navigate('/login');
              }
            });
        })
        .catch(err => {
          setError(err.message);
        });
    } else if (status === 'failed') {
      axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/logout`, {}, { withCredentials: true });
      navigate('/login', { replace: true });
    }
  }, [status, username, dispatch, navigate]);

  if (error) {
    //  Redux初期化
    dispatch(logout());
    localStorage.removeItem('csrf_token');
    navigate('/login');
    return (
      <>
        <div>Error: {error}</div>;
      </>
      
      
    )
  }

  if (status === 'loading' || !isAuthenticated || !user) {
    return <div><SyncLoader size={10} color={"#70F0B8"} /></div>;
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'row' }}>
      <PreviewDefaultHeaderBox />
      <Box style={{ 
        backgroundColor: reduxBackgroundType === 'color' ? reduxHeaderBackgroundColor : undefined,
        backgroundImage: reduxBackgroundType === 'image' ? `url(${process.env.REACT_APP_CLOUDFLARE_BG_IMG_URL + '/' + reduxBackgroundImagePath})` : undefined,
        backgroundAttachment: reduxBackgroundType === 'image' ? 'fixed' : undefined,  // 画像固定
        minHeight: "100vh", 
        marginRight: '0px', 
        paddingRight: '0px', 
        marginLeft: '0px', 
        paddingLeft: '0px', 
        width: '100%',
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}
        sx={{ ...fstyle}}
      >
      {/* <Box style={{ backgroundImage: 'url(${backGroundImagePath})', minHeight: "100vh", backgroundColor: reduxHeaderBackgroundColor, marginRight: '0px', paddingRight: '0px', marginLeft: '0px', paddingLeft: '0px', width: '100%' }}
        sx={{ ...fstyle}}
      > */}
        <Box height="84px" />
        <Box display="flex" alignItems="center" gap={2} sx={{ marginBottom: 2 }}>
          <PreviewColorPicker />
          <PublicUserPageDisplay />
          {/* <PublicUserPageDisplay />*/}
          {/* <DisplayUrl /> */}
          <Box sx={{ marginLeft: 'auto', marginRight: 2, marginBottom: 2 }}>
            <UserSettingIcon/>
          </Box>
        </Box>
        
        <PreviewNewsListBox />
        <Box height="50px" />
        {/* <PlaySpotify /> */}

        <ReadOptionContentList />
        <CreateOptionItemEditorButton />
        
        <Box height="200px" />
      </Box>

    </Box>
  );
};

export default EditComponent;