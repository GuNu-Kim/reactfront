import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import Container from 'layouts/Container';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Authentication from 'views/Authentication';
import BoardDetail from 'views/Board/Detail';
import BoardUpdate from 'views/Board/Update';
import BoardWrite from 'views/Board/Write';
import Main from 'views/Main';
import Search from 'views/Search';
import User from 'views/User';
import './App.css';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';

//component
function App() {
  //state: 로그인유저 전역상태
  const {setLoginUser, resetLoginUser} = useLoginUserStore();
  
  //state: cookie상태
  const [cookies, setCookie] = useCookies();

  //function: get sign in user response 처리함수
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...responseBody as GetSignInUserResponseDto };
    setLoginUser(loginUser);
  }

  //effect: accessToken cookie값이 변경될때마다 실행할 함수
  useEffect(() => {
    if(!cookies.accessToken){
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse)
  }, [cookies.accessToken]);
  
  //render
  //description 메인화면: '/' Main
  //description 로그인 + 회원가입 : '/auth' Authentication
  //description 검색화면 : '/search/:searchWord' Search
  //description 유저페이지 : '/user/:userEmail' User
  //description 게시물 상세보기 : '/board/detail/:boardNumber' BoardDetail
  //description 게시물 작성하기 : '/board/write/:boardNumber' BoardWrite
  //description 게시물 수정하기 : '/board/update/:boardNumber' BoardUpdate
  return (
     <Routes>
      <Route element={<Container/>}>
        <Route path={MAIN_PATH()} element={<Main/>}/>
        <Route path={AUTH_PATH()} element={<Authentication/>}/>
        <Route path={SEARCH_PATH(':searchWord')} element={<Search/>}/>
        <Route path={USER_PATH(':userEmail')} element={<UserP/>}/>
        <Route path={BOARD_PATH()}>
          <Route path={BOARD_WRITE_PATH()} element={<BoardWrite/>}/>
          <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail/>}/>
          <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate/>}/>
        </Route>
        <Route path='*' element={<h1>404 Not Found</h1>}/>
      </Route>
    </Routes>
  );
}

export default App;
