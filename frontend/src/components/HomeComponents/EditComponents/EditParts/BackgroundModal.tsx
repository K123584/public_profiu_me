import { Box, Button, IconButton, Modal, Tooltip } from "@mui/material";
import React from "react";
import HeaderBackgroundColor from "../../ColorPicker/HeaderColor/HeaderBackgroundColor";
import BodyBackgroundColor from "../../ColorPicker/BodyColor/BodyBackgroundColor";
import paletteIcon from '../palette.png';

export default function BackgroundModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>

                {/* ヘッダーパレット */}
                <Tooltip title="背景色を変更">
                    <IconButton style={{height: '50px', width: '50px'}}>
                        <img src={paletteIcon} className="palette-img" alt="palette" />
                    </IconButton>
                </Tooltip>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                araia-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{display: 'flex', marginTop: 15}}>
                    <BodyBackgroundColor onClose={handleClose} />
                </Box>
            </Modal>
        </div>
    )

}