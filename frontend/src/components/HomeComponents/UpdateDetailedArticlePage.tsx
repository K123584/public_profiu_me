import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, selectAuth } from '../../store/authSlice';
import { securedAxios as axios } from '../../axios';
import { Descendant } from 'slate';
import { BaseEditor } from 'slate';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { BaseText } from 'slate';
import Element from '../OptionItemEditors/Components/Element';
import Leaf from '../OptionItemEditors/Components/Leaf';
import { createEditor } from 'slate';
import OptionItemToolbar from '../OptionItemEditors/Components/OptionItemToolbar';
import { Box, Button } from '@mui/material';
import { FaPen } from 'react-icons/fa6';
import HorizontalLine from './HorizontalLine';

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor
type CustomElement = {
  type: string;
  align?: string;
  children: Descendant[];
  [key: string]: any;
}
type CustomText = BaseText & {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement
    Text: CustomText;
  }
}

interface NewsListProps {
  news_id: number;
  article_title: Descendant[];
  article_content: Descendant[];
}

function UpdateDetailedArticlePage() {
  const { username } = useAppSelector(selectAuth);
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<NewsListProps | null>(null);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      axios.get< { data: NewsListProps }>(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/newslistdetailget/${id}`, { withCredentials: true })
      .then(response => {
        console.log("Response data:", response.data.data);
        setArticle(response.data.data);
      })
      .catch(err => {
        setError(err.message);
        //強制logout
        //  Redux初期化
        dispatch(logout());
        localStorage.removeItem('csrf_token');
        navigate('/login');
      });
    }, [username]);
    

  return (
    <>
    {/* article && nullでない時という条件式 */}
    {article && (
      <UpdateArticleEditor
        news_id={article.news_id}
        article_title={article.article_title}
        article_content={article.article_content}
      />
    )}
  </>
  )
}

export const UpdateArticleEditor = ({ news_id, article_title, article_content }: NewsListProps) => {
  const { username } = useAppSelector(selectAuth);
  const { id } = useParams<{ id: string }>();
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  
  //editorインスタンス1つあたり、１つの<slate>コンポーネントしか使えないためeditorを分ける
  const titleEditor = useMemo(() => withReact(createEditor()), [])
  const contentEditor = useMemo(() => withReact(createEditor()), [])
  // const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  //article_title
  const [articleTitle, setArticleTitle] = React.useState<Descendant[]>(article_title);
  // const [articleTitleValue, setArticleTitleValue] = React.useState<Descendant[]>(article_title);

  //article_content
  const [articleContent, setArticleContent] = React.useState<Descendant[]>(article_content);
  // const [articleContentValue, setArticleContentValue] = React.useState<Descendant[]>(article_content);
  
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      // const jsonValue = JSON.stringify(value);
      const parsedTitle = articleTitle
      const parsedContent = articleContent;

      // const parsedContent = optionItemContent ? JSON.parse(optionItemContent) : [];
      
      const update_data = {
        news_id: news_id,
        article_title: parsedTitle,
        article_content: parsedContent
      };
      console.log('Sending update_data:', update_data);
      await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/newslistupdate/${id}`, 
        update_data,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
      // alert('Content saved successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to update content.');
    }
  };

  const handleDelete = async () => {
    try {

      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/newslistdelete/${id}`, 
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
      setIsEditing(false);
      navigate('/edit', { replace: true });


    } catch (error) {
      console.error('Error deleting article(news):', error);
      alert('削除できませんでした');
    }
  };



  const titleOnChange = (newTitleValue: Descendant[]) => {
    setArticleTitle(newTitleValue);
    // setArticleContent(newContentValue);
  };
  const contentOnChange = (newContentValue: Descendant[]) => {
    setArticleContent(newContentValue);
  };

  return (
    <div>
    {isEditing ? (
      <>
        <Box sx={{ width: "94%", marginLeft: "auto", marginRight: "auto"}}>
          <Slate editor={titleEditor} initialValue={articleTitle} onChange={titleOnChange}>
            <OptionItemToolbar />
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Edit your content..."
              spellCheck
              autoFocus
            />
          </Slate>
        </Box>
        <HorizontalLine />
        <Box sx={{ width: "94%", marginLeft: "auto", marginRight: "auto"}}>
          <Slate editor={contentEditor} initialValue={articleContent} onChange={contentOnChange}>
            <OptionItemToolbar />
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Edit your content..."
              spellCheck
              autoFocus
            />

          </Slate>
        </Box>
        <Box sx={{ width: "96%", marginLeft: "auto", marginRight: "auto"}}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            保存
          </Button>
          
          <Button variant="contained" color="primary" onClick={handleDelete}>
            削除
          </Button>
        </Box>
      </>
      
    ) : (
      <>
      <Box sx={{ width: "94%", marginLeft: "auto", marginRight: "auto"}}>
        <Slate editor={titleEditor} initialValue={articleTitle}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            readOnly
            placeholder="View your content..."
          />
        </Slate>
      </Box>
      
      <HorizontalLine />
      <Box sx={{ width: "94%", marginLeft: "auto", marginRight: "auto"}}>
        <Slate editor={contentEditor} initialValue={articleContent}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            readOnly
            placeholder="View your content..."
        />
        </Slate>
        
      </Box>
      <Box sx={{ width: "96%", marginLeft: "auto", marginRight: "auto"}}>
          <Button
            variant="contained"
            // startIcon={<FaPen />}
            onClick={() => setIsEditing(true)}
          >
            <FaPen />
          </Button>
        </Box>
      
        
        </>
    )}
  </div>
  )
};

export default UpdateDetailedArticlePage;