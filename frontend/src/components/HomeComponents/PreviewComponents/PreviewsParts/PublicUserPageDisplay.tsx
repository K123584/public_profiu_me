import React from 'react'
import { useAppSelector } from '../../../../store/hooks';
import { selectAuth } from '../../../../store/authSlice';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import paletteIcon from '../palette.png';
import DisplayUrl from './DisplayUrl';
import { Tooltip } from '@mui/material';

function PublicUserPageDisplay() {
    const { username }  = useAppSelector(selectAuth);
    
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleOpen} variant="contained" color="primary">
                
                <Tooltip title="公開ページへ">
                    <div>{username}さんのページURL</div>
    
                </Tooltip>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                araia-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{display: 'flex', marginTop: 15}}>
                    <DisplayUrl onClose={handleClose} />
                </Box>
            </Modal>
        </>
    )
}

export default PublicUserPageDisplay