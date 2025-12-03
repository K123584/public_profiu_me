import { Link } from "react-router-dom";
import './WelcomeHeader.css';
import { Button } from "@mui/material";


function WelcomeHeader() {
  return (
    <header className="header">
        <Link to="/" className="logo">
            Profiu.me
        </Link>
        <nav>
            <ul className="nav-links">
                <li>
                    <Button sx={{ color: "#c1d7e8" }}>
                        <Link to="/login">ログイン</Link>
                    </Button>
                        
                    
                </li>
                <li>
                    <Button sx={{ color: "#c1d7e8" }}>
                        <Link to="/signup">ユーザー登録</Link>
                    </Button>
                    
                </li>
            </ul>
        </nav>
        </header>
  );
}

export default WelcomeHeader;