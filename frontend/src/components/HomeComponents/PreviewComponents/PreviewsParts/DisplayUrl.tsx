import { Box, Button, Card, IconButton, TextField, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RedoIcon from '@mui/icons-material/Redo';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../../store/hooks';
import { selectAuth } from '../../../../store/authSlice';

function DisplayUrl({ onClose }: { onClose: () => void}) {
  const { username }  = useAppSelector(selectAuth);
  const origin = window.location.origin;
  
  const yourUrl = `${origin}/user/${username}`;

  const copyToClipboard = async(): Promise<void> => {
    await global.navigator.clipboard.writeText(yourUrl);
  }

  return (
    <Card sx={{ p: 2, backgroundColor: '#1976d2', color: 'white' }} variant="outlined">
      <Box display="flex" flexDirection="column" alignItems="flex-start">
      <div>{username}さんのページURL</div>
      <TextField
        defaultValue={yourUrl}
        disabled={true}
        sx={{ m: 1.2, width: `${yourUrl.length}ch`, color: 'black', backgroundColor: 'white' }}
      />
      <Box>
        <Tooltip title="コピーする" placement="top" arrow 
          PopperProps={{
            modifiers: [
              { name: 'zIndex', options: { zIndex: 100000 } },
            ],
          }}
          sx={{ width: '7ch' }}
        >
          <IconButton>
            <ContentCopyIcon onClick={copyToClipboard} sx={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
        <Link to={yourUrl}>
        <IconButton>
          <RedoIcon sx={{ color: 'white' }} />
          pageへ
        </IconButton>
      </Link>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          style={{marginLeft: 10, height: 40, backgroundColor: '#ED1A3D'}}
          >
          閉じる
        </Button>
      </Box>
    </Box>
  </Card>
    
  )
}


export default DisplayUrl
