import { securedAxios as axios } from '../../../../axios';
import { SketchPicker, ColorResult, TwitterPicker } from 'react-color';
import { selectAuth } from '../../../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setBackground } from '../../../../store/backgroundSlice';
import { Button } from '@mui/material';
import BodyBackgroundImagePicker from '../../BackgroundImagePicker/BodyBackgroundImagePicker';

function BodyBackgroundColor({ onClose }: { onClose: () => void}) {
    const { username } = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();
    const background = useAppSelector(state => state.background);

    const handleChangeComplete = async (color: ColorResult) => {
        dispatch(setBackground({
            ...background,
            background_id: background.background_id,
            background_color: color.hex,
            background_type: "color",
        }));
        // dispatch(setSelectedImageName("")); // 画像選択解除

        try {
            const data = {
                background_type: 'color',
                background_color: color.hex
            };

            const response = await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/backgroundupdate`, data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });

            if(response.status === 200) {
                console.log('submit success!');
                const nowColor = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/backgroundget`)
                // setBackground(nowColor.data.background_color);
                dispatch(setBackground(nowColor.data));
            } else {
                console.log('submit was failed');
            }
        } catch(error) {
            console.log('Error:', error);
        }

    };

  return (
    <>
        <TwitterPicker
        color={ background.background_color }
        onChangeComplete={ handleChangeComplete }
        />
        <BodyBackgroundImagePicker />
        <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            style={{marginLeft: 10, height: 40, backgroundColor: '#ED1A3D'}}
            >
            閉じる
        </Button>
    </>

  );
}

export default BodyBackgroundColor;
