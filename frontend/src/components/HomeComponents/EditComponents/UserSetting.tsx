import Logout from './Logout';
import DeleteAccount from './DeleteAccount';
import UserSettingHorizontalLine from './UserSettingHorizontalLine';
import { Box } from '@mui/material';
function UserSetting() {

    return (
        <>
            <h2>ユーザー設定</h2>
            <UserSettingHorizontalLine />
            <h3>ログアウト</h3>
            <Logout />
            <Box sx={{ marginBottom: 4}} />
            <UserSettingHorizontalLine />
            <h3>アカウント削除</h3>
            <DeleteAccount />

        </>
    )

    
}

export default UserSetting;