import React, { KeyboardEvent, ChangeEvent, useRef, useState, useEffect } from 'react';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';

//component
export default function Header() {
  
  //state cookie상태, 로그인상태
  const [cookie, setCookie] = useCookies();
  const [isLogin, setLogin] = useState<boolean>(false);
  const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();

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
      navigate(MAIN_PATH());
    };
    const onSignInButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };

    if(isLogin && userEmail===loginUser?.email)
    return(<div className='white-button' onClick={onSingOutButtonClickHandler}>{'로그아웃'}</div>);
    if(isLogin)
    //render
    return(<div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>);
    return(<div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>);
  }

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
          <SearchButton />
          <MyPageButton />
        </div>
      </div>
    </div>
  )
}
