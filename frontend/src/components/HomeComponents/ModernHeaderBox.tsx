import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { useParams } from 'react-router-dom';
import { securedAxios as axios } from '../../axios';
import { Descendant } from 'slate';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import { BaseText } from 'slate';
import { HistoryEditor } from 'slate-history';
import { BaseEditor } from 'slate';
import Leaf from '../OptionItemEditors/Components/Leaf';
import Element from '../OptionItemEditors/Components/Element';
import { createEditor } from 'slate';
import { SyncLoader } from 'react-spinners';
// import AdbIcon from '@mui/icons-material/Adb';

//headerのbackgroundcolorと文字のfontcolorを変更しDBに追加できる必要がある

interface Header {
    header_id: number;
    header_content: Descendant[];
    header_text: string;
    header_background_color: string;
    header_text_color: string;
    header_icon: string;
}

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



export default function ModernHeaderBox() {
  const { username } = useParams<{ username: string }>();
    const [header, setHeader] = useState<Header | null >(null);

  const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        axios.get<any>(`${process.env.REACT_APP_BACKEND_API_URL}/open/user/${username}/openheaderget`)
        .then(response => {
            console.log("Response data:", response.data);
            setHeader(response.data);
        })
        .catch(err => {
            setError(err.message);
        });
    }, [username])

//   useEffect(() => {
//           axios.get< {data: Header}>(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/headerget`, { withCredentials: true })
//           .then(response => {
//               console.log("Response data:", response.data);
//               dispatch(setHeader(response.data.data));
//               console.log("送信時ヘッダーのUsername:", username);
//           })
//           .catch(err => {
//               setError(err.message);
//               console.log("エラーヘッダーのUsername:", username);
//           });
//       }, [username])


  return (
    <>
        {header ? (
        <ModernHeader
            header_id={header.header_id}
            header_text={header.header_text}
            header_text_color={header.header_text_color}
            header_background_color={header.header_background_color}
            header_icon={header.header_icon}
            header_content={header.header_content}
        />
        ) : (
        <div><SyncLoader size={10} color={"#70F0B8"} /></div>
        )}
    </>
      
  );
}

function ModernHeader({
  header_id,
  header_text,
  header_text_color,
  header_background_color,
  header_icon,
  header_content
}: Header) {
    
    const [header, setHeader] = useState<Header | null >(null);
    const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
    const editor = useMemo(() => withReact(createEditor()), [])
    const [headerContent, setHeaderContent] = useState<Descendant[]>(header_content);
    const [error, setError] = useState<string | null>(null);
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

    return (
        <>
            <Box display="flex">
                <header
                    className="edit-header"
                    style={{
                        backgroundColor: header_background_color,
                        ...headerStyle
                    }}
                    >
                <Slate key={JSON.stringify(headerContent)} editor={editor} initialValue={headerContent} >
                    <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    readOnly
                    />
                </Slate>
                </header>
            </Box>
            </>
    )
}


// function ModernHeaderBox() {
//     const { username } = useParams<{ username: string }>();
//     const [header, setHeader] = useState<Header | null >(null);
//     const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//     const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         axios.get<any>(`${process.env.REACT_APP_BACKEND_API_URL}/open/user/${username}/openheaderget`)
//         .then(response => {
//             console.log("Response data:", response.data);
//             setHeader(response.data);
//         })
//         .catch(err => {
//             setError(err.message);
//         });
//     }, [username])

//     return (
//         <AppBar style={{ backgroundColor: header ? header.header_background_color : 'gray' }}>
//             <Container maxWidth="xl">
//                 <Toolbar disableGutters>
//                     <Box display="flex">
//                         <Avatar alt="User Icon" src={header ? header.header_icon : 'default_icon.png'} />

//                         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color={header ? header?.header_text_color : 'gray'} >
//                             {header ? header.header_text : 'Header Title!'}
//                         </Typography>
//                     </Box>
//                 </Toolbar>
//             </Container>
//         </AppBar>
//         // <div className="modern-header-box">
//         //     ModernHeaderBox
//         //     </div>
//     )
// }