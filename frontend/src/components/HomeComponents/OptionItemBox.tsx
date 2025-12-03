import { securedAxios as axios } from '../../axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { BaseEditor, BaseText, createEditor, Descendant } from 'slate'
import { HistoryEditor } from 'slate-history';
import Element from '../OptionItemEditors/Components/Element';
import Leaf from '../OptionItemEditors/Components/Leaf';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';


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
}

export default function OptionContentBox() {
  const { username } = useParams<{ username: string }>();

  const [optionContents, setOptionContents] = useState<OptionContentProps[] | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get< { data: OptionContentProps[] }>(`${process.env.REACT_APP_BACKEND_API_URL}/open/user/${username}/openoptioncontentget`, {
      withCredentials: true 
    })
    .then(response => {
      console.log("Response data:", response.data.data);
      setOptionContents(response.data.data);
    })
    .catch(err => {
      setError(err.message);
    });
  }, [username]);

  return (
    <>
        {optionContents?.map((content) => (
          <>
           <OptionContent option_item_id={content.option_item_id} option_content={content.option_content} />            
          </>
          
        ))}
    </>

  )
}

interface UpdateOptionContentsEditorProps {
  option_item_id: number;
  option_content: Descendant[];
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
  
export const OptionContent = ({option_item_id, option_content}: UpdateOptionContentsEditorProps) => {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])
  const [optionItemContent, setOptionItemContent] = React.useState<Descendant[]>(option_content);



  return (
    <div>
      <Slate editor={editor} initialValue={optionItemContent}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
          placeholder="View your content..."
        />
      </Slate>
  </div>
  )
};