import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectAuth } from '../../../../store/authSlice';
import { securedAxios as axios } from '../../../../axios';
import OptionItemEditor from '../../../OptionItemEditors/OptionItemEditor';
import { useNavigate } from 'react-router-dom';

interface Props {
  onSubmitted: () => void; // 成功時に親から閉じる処理
}

function SubmitOptionItemEditorButton({ onSubmitted }: Props) {
  const { username } = useAppSelector(selectAuth);
  const [optionItemContent, setOptionItemContent] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsedContent = optionItemContent ? JSON.parse(optionItemContent) : [];

      const data = {
        option_item_content: parsedContent,
      };

      console.log('Sending data:', data);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/optioncontentpost`,
        data,
        {
          //application/json--> https://wa3.i-3-i.info/word15819.html
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log('submit success!');
        // onSubmitted(); // 親のエディタ非表示トリガー
        window.location.reload();

      } else {
        console.error('Submit failed');
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>コンテンツ</p>
      <OptionItemEditor setOptionItemContent={setOptionItemContent} />
      {/* mui-button--> https://mui.com/material-ui/react-button/#basic-button*/}
      <Button 
        variant="contained" 
        type="submit" 
        color={optionItemContent.trim().length > 0 ? "primary" : "inherit"}
        disabled={optionItemContent.trim().length === 0}
      >
        送信
      </Button>
    </form>
  );
}

export default SubmitOptionItemEditorButton;
