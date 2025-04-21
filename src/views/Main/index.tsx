import React, { useEffect, useState } from 'react';
import './style.css';
import Top3Item from 'components/Top3Item';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock, top3BoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { useNavigate } from 'react-router-dom';
import { SEARCH_PATH } from 'constant';

//component 
export default function Main() {
  //function 내비게이트 함수
    const navigate = useNavigate();

  //component 상단 컴포넌트
  const MainTop = () => {

    //state 주간 top3 게시물 리스트 상태
    const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);

    //effect 첫 마운트 시 실행될 함수
    useEffect(() => {
      setTop3BoardList(top3BoardListMock);
    }, []);

    //render 상단 랜더링
    return (
    <>
      <div id = 'main-top-wrapper'>
        <div className='main-top-container'>
          <div className='main-top-title'>{'군우\'s보드에서\n다양한 이야기를 나눠보세요'}</div>
          <div className='main-top-content-box'>
            <div className='main-top-content-title'>{'주간 TOP3 게시글'}</div>
            <div className='main-top-content'>
              {top3BoardList.map(top3ListItem => <Top3Item top3ListItem={top3ListItem} />)}
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }

  //component 하단 컴포넌트
  const MainBottom = () => {
    
    //state 최신 게시물 리스트 상태
    const [currentBoardList, setcurrentBoardList] = useState<BoardListItem[]>([]);
    const [popularWordList, setPopularWordList] = useState<string[]>([]);

    // event handler 인기검색어 클릭 이벤트 처리
    const onPopularWordClickHandler = (word: string) => {
      navigate(SEARCH_PATH(word));
    }
    
    //effect 첫 마운트 시 실행될 함수
    useEffect(() => {
      setcurrentBoardList(latestBoardListMock);
      setPopularWordList(['에스파', '배그', '게임', '자유게시판', '개발자', '군대', '군우', '군대생활', '군대썰', '군대이야기', '군대후기', '군대잡담']);
    }, []);

    //render 하단 랜더링
    return (
      <>
        <div id='main-bottom-wrapper'>
          <div className='main-bottom-container'>
            <div className='main-bottom-title'>{'최신 게시물'}</div>
            <div className='main-bottom-content-box'>
              <div className='main-bottom-current-contents'>
                {currentBoardList.map(boardListItem => <BoardItem boardListItem={boardListItem}/>)}
              </div>
              <div className='main-bottom-popular-box'>
                <div className='main-bottom-popular-card'>
                  <div className='main-bottom-popular-card-container'>
                    <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                    <div className='main-bottom-popular-card-contents'>
                      {popularWordList.map(word => <div className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
                      <div className='word-badge'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='main-bottom-pagination-box'>
              {/* {Pagination/} */}
            </div>
          </div>
        </div>
      </>
    )
  }

  //render 메인화면 컴포넌트 상단: MainTop, 하단: MainBottom
  return (
    <>
      <MainTop/>
      <MainBottom/>
    </>
  )
}