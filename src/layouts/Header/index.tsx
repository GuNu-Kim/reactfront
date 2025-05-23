import React, { KeyboardEvent, ChangeEvent, useRef, useState, useEffect } from 'react';
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { useBoardStore, useLoginUserStore } from 'stores';
import { PatchBoardRequestDto, PostboardRequestDto } from 'apis/request/board';
import { PatchBoardResponseDto, PostBoardResponseDto } from 'apis/response/board';
import { fileUploadRequest, patchBoardRequest, postBoardRequest } from 'apis';
import { ResponseDto } from 'apis/response';

//component
export default function Header() {
  
  //state cookie상태, 로그인상태
  const [cookies, setCookie] = useCookies();
  const [isLogin, setLogin] = useState<boolean>(false);
  const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();
  
  const {pathname} = useLocation();
  const [isAuthPage, setAuthPage] = useState<boolean>(false);
  const [isMainPage, setMainPage] = useState<boolean>(false);
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
  const [isUserPage, setUserPage] = useState<boolean>(false);


  //function
  const navigate = useNavigate();

  //event handler
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  }

  //component 검색
  const SearchButton = () => {
    //state
    const [searchStatus, setSearchStatus] = useState<boolean>(false);
    const [word, setWord] = useState<string>('');
    const searchButtonRef = useRef<HTMLDivElement | null>(null);
    const {searchWord} = useParams();
    
    //event handler
    const onSearchButtonClickHandler = () => {
      if(!searchStatus){
        setSearchStatus(!searchStatus);
        return;
      }
      navigate(SEARCH_PATH(word));
    };
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setWord(value);
    };
    const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!searchButtonRef.current) return;
      searchButtonRef.current.click();
    };

    //effect
    useEffect(() =>{
      if(searchWord) {
        setWord(searchWord);
        setSearchStatus(true);
      }
    }, [searchWord]);
    
    if(!searchStatus)
    //render: Search
    return(
      <div className='icon-button' onClick={onSearchButtonClickHandler}>
        <div className='icon search-light-icon'></div>
      </div>
    );
    return(
      <div className='header-search-input-box'>
        <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
        <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      </div>
    );
  }

  //component 마이페이지 버튼
  const MyPageButton = () => {
    //state
    const {userEmail} = useParams();

    //event handler
    const onMyPageButtonClickHandler = () => {
      if(!loginUser) return;
      const {email} = loginUser;
      navigate(USER_PATH(email));
    };
    const onSingOutButtonClickHandler = () => {
      resetLoginUser();
      setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
      navigate(MAIN_PATH());
    };
    const onSignInButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };

    //render
    if(isLogin && userEmail===loginUser?.email)
    return(<div className='white-button' onClick={onSingOutButtonClickHandler}>{'로그아웃'}</div>);
    if(isLogin)
    return(<div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>);
    return(<div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>);
  }

  //component 업로드버튼
  const UploadButton = () => {
    
    //state
    const {boardNumber} = useParams();
    const {title, content, boardImageFileList, resetBoard} = useBoardStore();

    const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code==='AF' || code === 'NU') navigate(AUTH_PATH());
      if(code === 'VF') alert('제목과 내용은 필수 입니다.');
      if(code !== 'SU') return;

      resetBoard();
      if(!loginUser) return;
      const { email } = loginUser;
      navigate(USER_PATH(email));
    }

    const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code==='AF' || code === 'NU' || code === 'NB' || code === 'NP') navigate(AUTH_PATH());
      if(code === 'VF') alert('제목과 내용은 필수 입니다.');
      if(code !== 'SU') return;

      if(!boardNumber) return;
      navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
    }

    //event Handler
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookies.accessToken;
      if(!accessToken) return;

      const boardImageList: string[] = [];

      for(const file of boardImageFileList){
        const data = new FormData();
        data.append('file', file);

        const url = await fileUploadRequest(data);
        if(url) boardImageList.push(url);
      }

      const isWriterPage = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();
      if(isWriterPage) {
        const requestBody: PostboardRequestDto = {
          title, content, boardImageList
        }
        postBoardRequest(requestBody, accessToken).then(postBoardResponse);
      }
      else{
        if(!boardNumber) return;
        const requestBody: PatchBoardRequestDto = {
          title, content, boardImageList
        }
        patchBoardRequest(boardNumber, requestBody, accessToken).then(patchBoardResponse);
      }
    }

    //render
    if(title && content)
    return(<div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>);
    return(<div className='disable-button'>{'업로드'}</div>);
  }
  //effect: path가 변경될 때 마다 실행될 함수
  useEffect(() => {
    const isAuthPage = pathname.startsWith(AUTH_PATH());
    setAuthPage(isAuthPage);
    const isMainPage = pathname === MAIN_PATH();
    setMainPage(isMainPage);
    const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
    setSearchPage(isSearchPage);
    const isBoardDetailPage = pathname.startsWith(BOARD_PATH()+ '/' + BOARD_DETAIL_PATH(''));
    setBoardDetailPage(isBoardDetailPage);
    const isBoardWritePage = pathname.startsWith(BOARD_PATH()+ '/' + BOARD_WRITE_PATH());
    setBoardWritePage(isBoardWritePage);
    const isBoardUpdatePage = pathname.startsWith(BOARD_PATH()+ '/' + BOARD_UPDATE_PATH(''));
    setBoardUpdatePage(isBoardUpdatePage);
    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
  },[pathname]);

  //effect: login user가 변경될 때 마다 실행될 함수 
  useEffect(() => {
    setLogin(loginUser !== null);
  },[loginUser])

  //render:  Main
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon logo-dark-icon'></div>
          </div>
          <div className='header-logo'>{'kuns Board'}</div>
        </div>
        <div className='header-right-box'>
          {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton />}
          {(isUserPage || isMainPage || isSearchPage || isBoardDetailPage) && <MyPageButton />}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  )
}