import { securedAxios as axios } from '../../axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BaseEditor, BaseText, createEditor, Descendant } from 'slate'
import { HistoryEditor } from 'slate-history';
import { Slate, Editable, withReact, RenderElementProps, ReactEditor, RenderLeafProps } from 'slate-react'
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/authSlice';
import Leaf from './Components/Leaf';
import Element from './Components/Element';
import { FaPen, FaTrash } from "react-icons/fa6";
import { Button, IconButton } from '@mui/material';
import OptionItemToolbar from './Components/OptionItemToolbar';
import { useDispatch, useSelector } from 'react-redux';
// import { moveList, setOptionContents, removeOptionContent } from '../../store/optionContentsSlice';
import { RootState } from '../../store/store';
import { AiOutlineCaretDown, AiOutlineCaretUp} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { setOptionItems, moveList, removeOptionContent } from '../../store/optionItemsSlice';

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

interface OptionContentProps {
  option_content_id: number;
  option_item_id: number;
  option_content: Descendant[]; // JSON
  created_at: string;
  updated_at: string;
  option_item_sort_index: number;
}

export default function ReadOptionContentList() {
  const { username } = useAppSelector(selectAuth);
  const dispatch = useDispatch();
  const lists = useSelector((state: RootState) => state.optionItems.contents);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get< { data: OptionContentProps[] }>(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/optioncontentget`, { withCredentials: true })
    .then(response => {
      console.log("Response data:", response.data.data);

      dispatch(setOptionItems({
        contents: response.data.data,
        cards: [],
      }));
      // dispatch(setOptionContents(response.data.data));
    })
    .catch(err => {
      setError(err.message);
    });
  }, [username]);

  const handleMove = async (fromIndex: number, toIndex: number) => {
    //user/:username/edit/optionitemsortindexupdate

    const newIndexLists = [...lists];
    const [moved] = newIndexLists.splice(fromIndex, 1);
    newIndexLists.splice(toIndex, 0, moved);
    dispatch(moveList({ from_index: fromIndex, to_index: toIndex }));

    const updatedItems = newIndexLists.map((item, index) => ({
      option_item_id: item.option_item_id,
      option_item_sort_index: index,
    }));

    try {
      // console.log('送信前のCSRFトークン:', localStorage.getItem('csrf_token'));
      // console.log('送信前のCookie:', document.cookie);
      await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/optionitemsortindexupdate`,
      updatedItems,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    } catch (error) {
      console.error('Error updating sort index:', error);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {lists.map((item, index) => (
          <li key={item.option_content_id} style={{ listStyle: 'none' }}>
            <UpdateOptionContentsEditor index={index} option_item_id={item.option_item_id} option_content={item.option_content} option_item_sort_index={item.option_item_sort_index} onMove={handleMove} listLength={lists.length} />
          </li>
        ))}
      </ul>
    </div>
  );

}

interface UpdateOptionContentsEditorProps {
  option_item_id: number;
  option_content: Descendant[];
  option_item_sort_index: number;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  listLength: number;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
  
export const UpdateOptionContentsEditor = ({option_item_id, option_content, index, onMove, listLength }: UpdateOptionContentsEditorProps) => {
  const { username } = useAppSelector(selectAuth);
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])
  // const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [optionItemContent, setOptionItemContent] = React.useState<Descendant[]>(option_content);
  // const [value, setValue] = React.useState<Descendant[]>(option_content);
  const  dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      
      const parsedContent = optionItemContent

      //kesu
      console.log('Sending JSON content:', JSON.stringify(parsedContent, null, 2));
      
      const update_data = {
        option_item_id: option_item_id,
        // option_item_content: JSON.stringify(optionItemContent),
        option_item_content: parsedContent,
      };
      console.log('Sending update_data:', update_data);
      await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/optioncontentupdate`, 
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
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/optionitemdelete`, {
        data: { option_item_id: option_item_id },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
      dispatch(removeOptionContent(option_item_id));
      setIsEditing(false);
    } catch(error) {
      console.log('Error deleting option content:', error);
      alert('削除できませんでした');
    }
  }

  const onChange = (newValue: Descendant[]) => {
    // setValue(newValue);
    setOptionItemContent(newValue)
  };

  return (
    <div>
    {isEditing ? (
      // initialValue={value} pre値
      <Slate editor={editor} initialValue={optionItemContent} onChange={onChange}>
        <OptionItemToolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="テキストを入力"
          spellCheck
          autoFocus
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          保存
        </Button>
        {/* <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button> */}
      </Slate>
    ) : (
      <Slate editor={editor} initialValue={optionItemContent}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
          // placeholder="View your content..."
        />

        {/* 編集ボタン✏︎ */}
        <Button
          variant="outlined"
          style={{ backgroundColor: 'white', minWidth: 32, padding: 4, marginRight: 3 }}
          // disabled={!isEditing}
          // startIcon={<FaPen />}
          onClick={() => setIsEditing(true)}
        >
          <FaPen />
        </Button>
        
        {/* 削除ボタン🗑 */}
        <Button
          variant="outlined"
          style={{ backgroundColor: '#ED1A3D', color: 'white', minWidth: 32, padding: 4 }}

          // disabled={!isEditing}
          // startIcon={<FaPen />}
          onClick={handleDelete}
        >
          <FaTrash />
        </Button>
        <IconButton
          onClick={() =>
            onMove(index, index > 0 ? index - 1 : listLength - 1)
          }
        >
          <AiOutlineCaretUp />
        </IconButton>
        <IconButton
          onClick={() =>
            onMove(index, index < listLength - 1 ? index + 1 : 0)
          }
        >
          <AiOutlineCaretDown />
        </IconButton>


      </Slate>
    )}
  </div>
  )
};

