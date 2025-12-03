import React, { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

// import 'normalize.css';

import './App.css';

import Home from './pages/Home';
import { Icon } from './icons/bottomIcons';
import Register from './pages/SignUp';
import Login from './pages/Login';
import Edit from './pages/Edit';
import ModernHeaderBox from './components/HomeComponents/ModernHeaderBox';
import SignUp from './pages/SignUp';
import { Provider } from 'react-redux';
import store from './store/store';
import Welcome from './pages/Welcome';
import ArticleEdit from './components/HomeComponents/ArticleEditComponent/ArticleEdit';
import UserSetting from './components/HomeComponents/EditComponents/UserSetting';
import UpdateDetailedArticlePage from './components/HomeComponents/UpdateDetailedArticlePage';
import DetailedArticlePage from './components/HomeComponents/DetailedArticlePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
    <Provider store={store}>
      <div className="contents">

        <BrowserRouter>
            <div className="app">
              <Routes>

                {/* Open */}
                {/* userごとのページ */}
                <Route path="/user/:username" element={<Home />}/>
                <Route path="/user/:username/news/:id" element={<DetailedArticlePage />} />

                {/* edit
                もしlogin状態&&そのユーザーのページなら編集画面を表示 */}
                <Route path="/edit"  element={<Edit />} />
                <Route path="/edit/article_edit"  element={<ArticleEdit />} />
                <Route path="/edit/setting"  element={<UserSetting />} />
                <Route path="/edit/:username/news/:id" element={<UpdateDetailedArticlePage />} />

                <Route path="/signup"  element={<SignUp />} />
                <Route path="/login"  element={<Login />} />
                <Route path="/" element={<Welcome />} />

                <Route path="*" element={<NotFound />} />

                </Routes>
              </div>
          </BrowserRouter>
        </div>
      </Provider>
    </>
    
  );
}

export default App;
