import React, { useState } from 'react'
import ArticleContentEditor from './ArticleTextEditor/ArticleContentEditor'
import ArticleTitleEditor from './ArticleTextEditor/ArticleTitleEditor'
import { SubmitHandler, useForm } from 'react-hook-form';
import { securedAxios as axios } from '../../../axios';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout, selectAuth } from '../../../store/authSlice';
import { Box, Button } from '@mui/material';
import HorizontalLine from '../HorizontalLine';
import { useNavigate } from 'react-router-dom';

interface ArticleEditProps {
  article_title: string;
  content: string;
}


function ArticleEditPage() {
  const { handleSubmit } = useForm<ArticleEditProps>();
  const { username } = useAppSelector(selectAuth);
  const [article_title, setTitle] = useState('');
  const [article_content, setContent] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ArticleEditProps> = async () => {
    try {
      // 空文字列の場合はデフォルト値を設定
      const parsedTitle = article_title ? JSON.parse(article_title) : {};
      const parsedContent = article_content ? JSON.parse(article_content) : {};

      const data = { 
        article_title: parsedTitle, 
        article_content: parsedContent 
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/newslistpost`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });

      if(response.status === 200) {
        console.log('submit success!');
        navigate('/edit', { replace: true });
      } else {
        console.log('Failed to submit');
      }
    } catch (error) {
      console.log('Error:', error);
      //強制logout
      //  Redux初期化
      dispatch(logout());
      localStorage.removeItem('csrf_token');
      navigate('/login');
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <Box sx={{ width: "94%", marginLeft: "auto", marginRight: "auto"}}>
      <ArticleTitleEditor setTitle={setTitle} />
    </Box>
    <HorizontalLine />
    <Box sx={{ width: "94%", marginLeft: "auto", marginRight: "auto"}}>
      <ArticleContentEditor setContent={setContent} />
    </Box>
    <Box sx={{ width: "97%", marginLeft: "auto", marginRight: "auto"}}>
      <Button 
          variant="contained" 
          type="submit" 
          color={article_title.trim().length > 0 && article_content.trim().length > 0 ? "primary" : "inherit"}
          disabled={article_title.trim().length === 0 || article_content.trim().length === 0}
        >
          送信
        </Button>
    </Box>
    
    </form>
  )
}

export default ArticleEditPage