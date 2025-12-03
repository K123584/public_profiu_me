import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useAppSelector } from '../../../store/hooks';
import { selectAuth } from '../../../store/authSlice';
import { useEffect, useState } from 'react';
import { securedAxios as axios } from '../../../axios';
import { Descendant } from 'slate';
import { Button } from '@mui/material';
import { FaCirclePlus } from 'react-icons/fa6';

interface NewsListProps {
    news_id: number;
    article_title: Descendant[];
    article_content: Descendant[];
}

interface NewsListItemProps extends ListChildComponentProps {
    data: NewsListProps[];
}

function CreateNewsButton() {
    return (
        <Button startIcon={<FaCirclePlus />} variant="contained" color="primary" component="a" href={`edit/article_edit`} rel="noopener noreferrer">
            新しい記事
        </Button>
    );
}

function NewsListItem(props: NewsListItemProps) {
    const {index, style, data} = props;
    const newsItem = data[index];
    const { username } = useAppSelector(selectAuth);

    const titleText = extractPlainText(newsItem.article_title);

    return (
        <>
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton component="a" href={`edit/${username}/news/${newsItem.news_id}`} rel="noopener noreferrer">
                    <ListItemText primary={titleText}  />
                </ListItemButton>
            </ListItem>
        </>
    );
}

function extractPlainText(descendants: Descendant[]): string {
    return descendants
      .map(node => {
        if ('text' in node) {
          return node.text;
        }
        if ('children' in node && Array.isArray(node.children)) {
          return extractPlainText(node.children);
        }
        return '';
      })
      .join('');
  }
  
export default function PreviewNewsListBox() {
    const { username } = useAppSelector(selectAuth);

    const [newsList, setNewsList] = useState<NewsListProps[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get< {data: NewsListProps[] }>(`${process.env.REACT_APP_BACKEND_API_URL}/user/${username}/edit/newslistget`, { withCredentials: true })
        .then( response => {
            console.log("NewsList Response data:", response.data);
            setNewsList(response.data.data);
        })
        .catch(err => {
            setError(err.message);
        });
    }, [username]);

    return (
        <>
            <Box className="news-list-box"
                
                sx={{marginTop: 8, zswidth: '100%', height: 200, maxWidth: 360}}
            >
                <ListItemText
                sx={{marginLeft: '130px', marginRight: 'auto', marginBottom: '15px'}}
                    primary="news"
                    primaryTypographyProps={{
                        fontSize: 20,
                        fontWeight: 'medium',
                        color: 'white',
                        letterSpacing: 0,
                      }}
                >

                </ListItemText>
                
                <Box
                    sx={{width: '100%', height: 150, maxWidth: 360, bgcolor: 'rgba(255, 255, 255, 0.8)'}}
                        // sx={{marginTop: '84px', width: '100%', height: 150, maxWidth: 360, bgcolor: 'background.paper', borderRadius: '3%', borderTop: '55px solid #3591eb', borderBottom: '20px solid #3591eb', borderLeft: '25px solid #3591eb', borderRight: '25px solid #3591eb'}}
                >
                    
                    <FixedSizeList
                        height={150}
                        width={360}
                        itemSize={46}
                        itemCount={newsList ? newsList.length : 0}
                        overscanCount={5}
                        itemData={newsList ? newsList : []}
                    >
                        {NewsListItem}
                    </FixedSizeList>
                </Box>
                <CreateNewsButton />
            </Box>
            
            
        </>
    )
}
