import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/authSlice';
import axios from 'axios';
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
import { FaRegPenToSquare } from 'react-icons/fa6';
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

function DetailedArticlePage() {
  const { username } = useParams<{ username: string }>();
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<NewsListProps | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      axios.get< { data: NewsListProps }>(`${process.env.REACT_APP_BACKEND_API_URL}/open/user/${username}/opennewsdetailget/${id}`, { withCredentials: true })
      .then(response => {
        console.log("Response data:", response.data.data);
        setArticle(response.data.data);
      })
      .catch(err => {
        setError(err.message);
      });
    }, [username]);
    

  return (
    <>
    {/* article && nullでない時という条件式 */}
    {article && (
      <DisplayArticleEditor
        news_id={article.news_id}
        article_title={article.article_title}
        article_content={article.article_content}
      />
    )}
  </>
  )
}

export const DisplayArticleEditor = ({ news_id, article_title, article_content }: NewsListProps) => {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  
  //editorインスタンス1つあたり、１つの<slate>コンポーネントしか使えないためeditorを分ける
  const titleEditor = useMemo(() => withReact(createEditor()), [])
  const contentEditor = useMemo(() => withReact(createEditor()), [])

  //article_title
  const [articleTitle, setArticleTitle] = React.useState<Descendant[]>(article_title);

  //article_content
  const [articleContent, setArticleContent] = React.useState<Descendant[]>(article_content);
  
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <>
      <Box sx={{ width: "94%", marginLeft: "auto", marginRight: "auto"}}>
        <Slate editor={titleEditor} initialValue={articleTitle}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            readOnly
            // placeholder=""
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
              // placeholder=""
            />
          </Slate>
        </Box>
      
        </>
  </div>
  )
};

export default DetailedArticlePage;