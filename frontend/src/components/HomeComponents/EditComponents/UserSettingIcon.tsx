import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
function UserSettingIcon() {

    return (
        <>
            <Button style={{backgroundColor: 'rgba(128, 128, 128, 0.2)'}}>
                <Link to="/edit/setting">
                    <SettingsOutlinedIcon style={{height: '40px', width: '40px'}} />
                </Link>
            </Button>
        </>
    )

    
}

export default UserSettingIcon;