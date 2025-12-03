import React from 'react'
import UpdateHeaderButton from './PreviewsParts/UpdateHeaderButton';

function PreviewDefaultHeaderBox() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    
    return (

        <UpdateHeaderButton />
    )
}

export default PreviewDefaultHeaderBox;