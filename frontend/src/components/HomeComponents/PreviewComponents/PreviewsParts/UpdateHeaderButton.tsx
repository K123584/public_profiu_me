import React, { useState, ReactNode, MouseEvent, useEffect, useCallback, useMemo } from 'react';
import { AppBar, Avatar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { securedAxios as axios } from '../../../../axios';
import { useAppSelector } from '../../../../store/hooks';
import { selectAuth } from '../../../../store/authSlice';
import { FaPen } from 'react-icons/fa6';
import { BaseEditor, Descendant } from 'slate';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { BaseText } from 'slate';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader } from '../../../../store/HeaderSlice';
import { RootState } from '../../../../store/store';
import { createEditor } from 'slate';
import Element from '../../../OptionItemEditors/Components/Element';
import Leaf from '../../../OptionItemEditors/Components/Leaf';
import OptionItemToolbar from '../../../OptionItemEditors/Components/OptionItemToolbar';
import HeaderModal from '../../EditComponents/EditParts/HeaderModal';


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

interface Header {
    header_id: number;
    header_content: Descendant[];
    header_text: string;
    header_background_color: string;
    header_text_color: string;
    header_icon: string;

}

export default function UpdateHeaderButton() {
  const { username } = useAppSelector(selectAuth);
  const dispatch = useDispatch();
  const header = useSelector((state: RootState) => state.header);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
          axios.get< {data: Header}>(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/headerget`, { withCredentials: true })
          .then(response => {
              console.log("Response data:", response.data);
              dispatch(setHeader(response.data.data));
              console.log("送信時ヘッダーのUsername:", username);
          })
          .catch(err => {
              setError(err.message);
              console.log("エラーヘッダーのUsername:", username);
          });
      }, [username])


  return (
      <UpdateButton
        header_id={header.header_id} header_text={header.header_text} header_text_color={header.header_text_color} header_background_color={header.header_background_color} header_icon={header.header_icon} header_content={header.header_content}
      />
  );
}

function UpdateButton({
  header_id,
  header_text,
  header_text_color,
  header_background_color,
  header_icon,
  header_content

}: Header) {
  const { username } = useAppSelector(selectAuth);
  const reduxHeaderBackgroundColor = useAppSelector(state => state.header.header_background_color);
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])
  const [headerContent, setHeaderContent] = useState<Descendant[]>(header_content);
  const [isEditing, setIsEditing] = useState(false);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(header_background_color);
  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    boxShadow: "0 2px 5px #00000033",
    zIndex: 1100,
  };

  useEffect(() => {
    setHeaderContent(header_content);
  }, [header_content]);

  const handleSave = async () => {
    try {
      // const jsonValue = JSON.stringify(value);
      const parsedContent = headerContent
      // const parsedContent = optionItemContent ? JSON.parse(optionItemContent) : [];
      
      const update_data = {
        header_id: header_id,
        header_content: parsedContent,
      };
      console.log('Sending update_data:', update_data);
      await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/headerpost`, 
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
      alert('Failed to update header.');
    }
  };
      
      
    //error
    const [error, setError] = useState<string | null>(null);

    const onChange = (newValue: Descendant[]) => {
        // setValue(newValue);
        setHeaderContent(newValue)
      };
    

  return(
    <section>
    {isEditing ?  (
      <>
        <Box display="flex">
          <header
            className="edit-header"
            style={{
              backgroundColor: reduxHeaderBackgroundColor,
              ...headerStyle,
              height: isEditing ? "auto" : "64px",
              minHeight: "64px",
              flexDirection: "column",
            }}
          >
            <Slate key={JSON.stringify(headerContent)} editor={editor} initialValue={headerContent} onChange={onChange}>
              <Box display="flex" flexDirection="column" gap={1}>
                <OptionItemToolbar />
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="ヘッダー"
                  spellCheck
                  autoFocus
                />
                <Button variant="contained" color="primary" onClick={handleSave} style={{height: 40 , width: 10}}>
                保存
                </Button>
              </Box>
              <HeaderModal />
              
            </Slate>
          </header>
        </Box>

      </>
      
    ) : (
      <>
        <Box display="flex">
          <header
            className="edit-header"
            style={{
              backgroundColor: reduxHeaderBackgroundColor,
              ...headerStyle
            }}
          >
            <Slate key={JSON.stringify(headerContent)} editor={editor} initialValue={headerContent} >
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                readOnly
              />
              <Button
                variant="outlined"
                style={{ backgroundColor: 'white', minWidth: 32, padding: 4, marginRight: 30 }}
                onClick={() => setIsEditing(true)}
              >
                <FaPen />
              </Button>
            </Slate>
          </header>
        </Box>
      </>

    )}
  </section>
  );
}