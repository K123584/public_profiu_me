import { securedAxios as axios } from '../../../../axios';
import React, { useContext, useState } from 'react';
import {ChromePicker, ColorResult, CompactPicker, SketchPicker, TwitterPicker } from 'react-color';
import { Button } from '@mui/material';
import { selectAuth } from '../../../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setHeader } from '../../../../store/HeaderSlice';

function HeaderBackgroundColor({ onClose }: { onClose: () => void }) {
    const { username } = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();
    const header = useAppSelector(state => state.header);

    const handleChangeComplete = async (color: ColorResult) => {
        // Reduxのheaderを更新
        dispatch(setHeader({
        ...header,
        header_id: header.header_id,
        header_background_color: color.hex,
        }));

        try {
            const update_data = {
                header_id: header.header_id,
                header_background_color: color.hex,
            };

            const response = await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/headerpost`, update_data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });

            if(response.status === 200) {
                console.log('submit success!');

            } else {
                console.log('submit was failed');
            }
        } catch(error) {
            console.log('Error:', error);
        }
    };
        
    const customColors = [
        '#69c1cd','#fdd1d2','#98e7ec','#524f96','#fdefee','#f5a3df','#e8f1f8',
        '#ffccff','#ff99cc','#f8f8ff','#ffe4e1','#fff0f5','#fffaf0','#faf0e6',
        '#faebd7','#FF9800','#ffebcd','#ffe4c4','#ffdab9','#f0fff0','#f5fffa',
        '#f0ffff','#f0f8ff','#e6e6fa','#4169e1','#b0e0e6','#40e0d0','#48d1cc',
        '#20b2aa','#008b8b','#006400','#008000','#3cb371','#fafad2','#f5deb3',
        '#a0522d','#8b4513','#800000','#8b0000','#a52a2a','#b22222','#cd5c5c',
        '#ff0000','#ff4500','#dc143c','#800080','#7b68ee','#FFEB3B','#FFC107',
        '#FF9800','#000000','#ffffff','#696969','#808080','#dcdcdc','#f5f5f5'
    ];

    return (
      <>

        <ChromePicker
          color={ header.header_background_color }
          onChangeComplete={ handleChangeComplete }
        />
        <div style={{ height: 20}}></div>
        <TwitterPicker
          color={ header.header_background_color }
          colors={ customColors }
          onChangeComplete={ handleChangeComplete }
        />
        <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            style={{marginLeft: 10}}
        >
            閉じる
        </Button>

    
      </>
    );
}

export default HeaderBackgroundColor;

