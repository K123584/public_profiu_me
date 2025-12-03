import { Button, Card, CardContent, FormControl, ImageList, ImageListItem, Radio, RadioGroup } from "@mui/material";
import { selectAuth } from "../../../store/authSlice";
import { setBackground} from "../../../store/backgroundSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import React from "react";
import { securedAxios as axios } from "../../../axios";

function BodyBackgroundImagePicker() {
    const { username } = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();
    const background = useAppSelector(state => state.background);

    const imageNames = ['01_wave.jpg', '02_pinkcloud.jpg'];
    // const imageUrls = imageNames.map(name => `${process.env.REACT_APP_CLOUDFLARE_BG_IMG_URL}/${name}`);

    // 選択状態はファイル名のみで管理
    const selectedImageName = useAppSelector(state => state.background.selectedImageName);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        //e.target.valueで最新の値取得
        const fileName = e.target.value;
        // dispatch(setSelectedImageName(fileName));

        dispatch(setBackground({
            ...background,
            background_id: background.background_id,
            background_image_path: fileName,
            background_type: 'image',
        }));

        try {
            const data = {
                background_type: 'image',
                background_image_path: fileName,
            };

            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/backgroundupdate`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                }
            );

            if(response.status === 200) {
                const nowBGImage = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/backgroundget`)
                dispatch(setBackground(nowBGImage.data));
            }
        } catch(error) {
            console.log('Error:', error);
        }
    };

    const cardStyle = {
        display: "block",
        transitionDuration: "0.3s",
        height: "450px",
        width: "400px",
        variant: "outlined",
    };

    return (
        <>
            <Card style={cardStyle}>
                <CardContent>
                    <FormControl sx={{height: 1}}>
                        <RadioGroup
                            value={selectedImageName}
                            onChange={handleChange}
                            sx={{height: 1}}
                        >
                            <ImageList
                                variant='woven'
                                cols={2}
                                gap={8}
                            >
                                {imageNames.map((name, i) => (
                                    <Radio
                                        key={i}
                                        value={name}
                                        icon={
                                            <ImageListItem>
                                                <img
                                                    src={`${process.env.REACT_APP_CLOUDFLARE_BG_IMG_URL}/${name}?w=164&h=164&fit=crop&auto=format`}
                                                    srcSet={`${process.env.REACT_APP_CLOUDFLARE_BG_IMG_URL}/${name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                    loading='lazy'
                                                />
                                            </ImageListItem>
                                        }
                                        checkedIcon={
                                            <ImageListItem sx={{border: 4}}>
                                                <img
                                                    src={`${process.env.REACT_APP_CLOUDFLARE_BG_IMG_URL}/${name}?w=164&h=164&fit=crop&auto=format`}
                                                    srcSet={`${process.env.REACT_APP_CLOUDFLARE_BG_IMG_URL}/${name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                    loading='lazy'
                                                />
                                            </ImageListItem>
                                        }
                                    />
                                ))}
                            </ImageList>
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        </>
    )
}

export default BodyBackgroundImagePicker;