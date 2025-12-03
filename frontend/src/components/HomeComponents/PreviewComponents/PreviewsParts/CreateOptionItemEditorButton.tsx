import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OptionItemEditor from '../../../OptionItemEditors/OptionItemEditor';
import SubmitOptionItemEditorButton from './SubmitOptionItemEditorButton';
import { FaCirclePlus } from 'react-icons/fa6';

export default function CreateOptionItemEditorButton() {
  const [editorVisible, setEditorVisible] = React.useState<boolean>(false); // 単一のエディタを管理する状態

  const handleAddEditor = () => {
    setEditorVisible(true); // エディタを表示
  };

  const handleRemoveEditor = () => {
    setEditorVisible(false); // エディタを非表示
  };

  const addEditorButton = (
    <Button
      style={{ marginTop: '15px', marginLeft: '39px' }}
      startIcon={<FaCirclePlus />}
      variant="contained"
      onClick={handleAddEditor}
    >
        テキストを追加
    </Button>
  );

  return (
    <div>
      {editorVisible && (
        <div style={{ position: 'relative', marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
          <IconButton
            style={{ position: 'absolute', right: '10px', top: '10px' }}
            onClick={handleRemoveEditor}
          >
            <CloseIcon />
          </IconButton>
          {/* <OptionItemEditor /> */}
          <SubmitOptionItemEditorButton onSubmitted={handleRemoveEditor} />
        </div>
      )}
      {addEditorButton}
    </div>
  );
}