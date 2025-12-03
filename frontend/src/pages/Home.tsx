import React from "react";
import { Box } from "@mui/material";
import NewsListBox from "../components/HomeComponents/NewsListBox";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { securedAxios as axios } from "../axios";
import ModernHeaderBox from "../components/HomeComponents/ModernHeaderBox";
import { SyncLoader } from "react-spinners";
import OptionContentBox from "../components/HomeComponents/OptionItemBox";

interface User {
    id: number;
    username: string;
    main_profile_title: string;
    main_profile_text: string;
}

interface NewsListType {
    // id: number;
    news_id: number;
    news_title: string;
    news_content: string;
}

interface Background {
    background_color: string;
    background_text_color: string;
    background_type: string;
    background_image_path: string;
}

const Home = () => {
    //make user dir
    const { username } = useParams<{ username: string }>();
    //User
    const [user, setUser] = useState<User | null>(null);

  
    //NewsList
    const [newsList, setNewsList] = useState<NewsListType[]>([]);
    // const [newsList, setNewsList] = useState<NewsListType | null>(null);
    const [background, setBackground] = useState<Background | null>(null);
    //error
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();



    useEffect(() => {
        //Userからany
        axios.get<any>(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}`)
        .then(response => {
            console.log("Response data:", response.data);
            setUser(response.data);
    
        })
        .catch(err => {
            setError(err.message);
            navigate('/', { replace: true });
        });
    }, [username]);

    useEffect(() => {
        axios.get<any>(`${process.env.REACT_APP_BACKEND_API_URL}/open/user/${username}/openbackgroundget`)
        .then(response => {
          console.log("Response data:", response.data);
          setBackground(response.data);
        })
        .catch(err => {
          setError(err.message);
        })
      }, [username])


    return (
        <>
            <Box display="flex" flexDirection="column">
                <ModernHeaderBox />
            </Box>

            <Box style={{
                minHeight: "100vh",
                backgroundColor: background?.background_type === 'color' ? background.background_color : undefined,
                backgroundImage: background?.background_type === 'image' ? `url(${process.env.REACT_APP_CLOUDFLARE_BG_IMG_URL + '/' + background?.background_image_path})` : undefined,
                backgroundAttachment: background?.background_type === 'image' ? 'fixed' : undefined,//画像固定
                backgroundSize: background?.background_type === 'image' ? 'cover' : undefined, // 画像をコンテナに合わせて拡大縮小
                }}
            >
            {/* headerの間隔を開ける */}
            <Box height="60px" />
                <div className="home-boxes-layout">
                    <NewsListBox />
                    <div>
                        <OptionContentBox />
                    </div>
                </div>
                <Box height="200px" />
            </Box>

        </>
    );
};

export default Home;