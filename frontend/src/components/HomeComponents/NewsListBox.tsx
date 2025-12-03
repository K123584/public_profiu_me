import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { useEffect, useState } from 'react';
import { securedAxios as axios } from '../../axios';
import { Descendant } from 'slate';
import { useParams } from 'react-router-dom';

interface NewsListProps {
    // 	ArticleTitle   datatypes.JSON `json:"article_title"`
    // ArticleContent datatypes.JSON `json:"article_content"`
    news_id: number;
    article_title: Descendant[];
    article_content: Descendant[];

    // news_title: string;
    // news_content: string;
}

interface NewsListItemProps extends ListChildComponentProps {
    data: NewsListProps[];
}

// /edit/newslistget

function NewsListItem(props: NewsListItemProps) {
    const {index, style, data} = props;
    const newsItem = data[index];
    const { username } = useParams<{ username: string }>();

    const titleText = extractPlainText(newsItem.article_title);

    return (
        <>
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton component="a" href={`${username}/news/${newsItem.news_id}`} rel="noopener noreferrer">
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
  

// export default function NewsListBox({newsList}: {newsList: NewsListProps[]} ) {
// export default function NewsListBox(props: NewsListProps[] ) {
export default function NewsListBox() {
    const { username } = useParams<{ username: string }>();

    const [newsList, setNewsList] = useState<NewsListProps[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get< {data: NewsListProps[] }>(`${process.env.REACT_APP_BACKEND_API_URL}/open/user/${username}/opennewsget`, { withCredentials: true })
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
        {newsList && newsList.length > 0 && (
            <Box className="news-list-box"
                
                sx={{marginTop: 8, zswidth: '100%', height: 200, maxWidth: 360}}
            >
            {/* <Box className="news-list-box"
                
                sx={{marginTop: 8, zswidth: '100%', height: 200, maxWidth: 360,bgcolor: '#3591eb',borderRadius: '3%', borderTop: '5px solid #3591eb', borderBottom: '15px solid #3591eb', borderLeft: '15px solid #3591eb', borderRight: '15px solid #3591eb'}}
            > */}
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
            </Box>
            )
        }

            
            
        </>
    )
}
