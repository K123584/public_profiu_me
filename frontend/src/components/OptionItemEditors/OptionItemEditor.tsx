import React, { useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate, RenderElementProps, RenderLeafProps, ReactEditor } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
  BaseText,
} from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'

import { Button, Icon} from './Components'
import Leaf from './Components/Leaf'
import Element from './Components/Element'
import OptionItemToolbar from './Components/OptionItemToolbar'

type CustomElement = {
  type: string
  align?: string
  children: Descendant[]
  [key: string]: any;
}

type CustomText = BaseText & {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
};


type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText;
  }
}

//mod(モディファイアーキー(ショートカットキー))
//ex mob+bでctrl + b -> bold(macはopt + b)
const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const OptionItemEditor = ({setOptionItemContent}: {setOptionItemContent: (value: string) => void}) => {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = React.useState<Descendant[]>(initialValue);

  const onChange = (newValue: Descendant[]) => {
    setValue(newValue);
    const jsonValue = JSON.stringify(newValue);
    setOptionItemContent(jsonValue);
  };

  return (
    <Slate
      editor={editor} 
      initialValue={initialValue}
      onChange={onChange}
      >
    <OptionItemToolbar />
      
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: CustomEditor, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as CustomElement)[blockType] === format,
    })
  )

  return !!match
}
export const toggleColorMark = (editor: Editor, color: string) => {
  if (!color) return

  const marks = Editor.marks(editor) as Record<string, any> | null;
  const isActive = marks ? marks["color"] !== undefined : false;

  if (isActive) {
    Editor.removeMark(editor, "color");
  }
  Editor.addMark(editor, "color", color);
}


export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as Record<string, any>
  return marks ? marks[format] !== undefined : false
}

export const BlockButton = ({ format, icon }: {format: string; icon: string}) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

export const MarkButton = ({ format, icon }: {format: string; icon: string}) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: '' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: '' },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: '' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: '' }],
  },
]

export default OptionItemEditor