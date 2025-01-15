import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import FavoriteItem from 'components/FavoriteItem';
import { Board, CommentListItem, FavoriteListItem } from 'types/interface';
import { commentListMock, favoriteListMock } from 'mocks';
import CommentItem from 'components/CommentItem';
import Pagination from 'components/Pagination';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useLoginUserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { getBoardRequest, getCommentListRequest, getFavoriteListRequest, increaseViewCountRequest } from 'apis';
import GetBoardResponseDto from 'apis/response/board/get-board.response.dto';
import { ResponseDto } from 'apis/response';
import { GetCommentListResponseDto, GetFavoriteListResponseDto, IncreaseViewCountResponseDto } from 'apis/response/board';
import dayjs from 'dayjs';

//Component
export default function BoardDetail() {
  //State
  const {boardNumber} = useParams();
  const {loginUser } = useLoginUserStore();

  //Function
  const navigator = useNavigate();
  const increaseViewCountResponse = (responseBody: IncreaseViewCountResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code==='NB') alert('존재하지 않는 게시물 입니다.');
    if(code==='DBE') alert('데이터베이스 에러 입니다.');
  }

  const BoardDetailTop = () => {

    //state
    const[isWriter, setWriter] = useState<boolean>(false);
    const[board, setBoard] = useState<Board | null>(null);
    const[showMore, setShowMore] = useState<boolean>(false);

    
    //function
    const getWriteDatetimeFormat = () => {
      if(!board) return '';
      const date = dayjs(board.writeDateTime);
      return date.format('YYYY. MM. DD');
    }

    const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code } = responseBody;
      if(code === 'NB') alert('존재하지 않는 게시물 입니다.');
      if(code === 'DBE') alert('데이터베이스 오류 입니다.');
      if(code !== 'SU') {
        navigator(MAIN_PATH());
        return;
      }

      const board: Board = {...responseBody as GetBoardResponseDto}
      setBoard(board);

      if(!loginUser) {
        setWriter(false);
        return;
      }
      const isWriter = loginUser.email === board.writerEmail;
      setWriter(isWriter);
    }

    // event handler
    const onNicknameClickHandler = () => {
      if(!board) return;
      navigator(USER_PATH(board.writerEmail));
    }

    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
    }
    // 수정
    const onUpdateButtonClickHandler = () => {
      if(!board) return;
      //if(!board || !loginUser) return;
      //if(loginUser.email !== board.writerEmail) return;
      navigator(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardNumber));
    }
    //삭제
    const onDeleteButtonClickHandler = () => {
      if(!board) return;
      //if(!board || !loginUser) return;
      //if(loginUser.email !== board.writerEmail) return;
      //TODO delete request 만들기
      navigator(MAIN_PATH());
    }
    
    //effect 게시물 번호 path variable이 바뀔때 마다 게시물 불러오기
    useEffect(() => {
      if(!boardNumber) {
        navigator(MAIN_PATH());
        return;
      }
      getBoardRequest(boardNumber).then(getBoardResponse);

      //setBoard(boardMock);
    },[boardNumber]);

    if(!board) return <></>
    return (
      <div id='board-detail-top'>
        <div className='board-detail-header'>
          <div className='board-detail-title'>{board.title}</div>
          <div className='board-detail-top-sub-box'>
            <div className='board-detail-write-info-box'>
              <div className='board-detail-writer-profile-image' style={{backgroundImage: `url(${board.witerProfileImage ? board.witerProfileImage : defaultProfileImage})`}}></div>
              <div className='board-detail-writer-nickname' onClick={onNicknameClickHandler}>{board.writerNickName}</div>
              <div className='board-detail-info-divider'>{'\|'}</div>
              <div className='board-detail-writer-date'>{getWriteDatetimeFormat()}</div>
            </div>
            {isWriter &&
            <div className='icon-button' onClick={onMoreButtonClickHandler}>
              <div className='icon more-icon'></div>
            </div>
            }
            {showMore &&
            <div className='board-detail-more-box'>
              <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
              <div className='divider'></div>
              <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
            </div>
            }
          </div>
        </div>
        <div className='divider'></div>
        <div className='board-detail-top-main'>
          <div className='board-detail-main-text'>{board.content}</div>
          {board.boardImageList.map(image => <img className='board-detail-main-image' src={image} />)}
        </div>
      </div>
    )
  }

  const BoardDetailBottom = () => {
    //State
    //리스트 가져오기
    const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
    const [commentList, setCommentList] = useState<CommentListItem[]>([]);
    //리스트상자 On/Off
    const [showFavorite, setShowFavorite] = useState<boolean>(false);
    const [showComment, setShowComment] = useState<boolean>(false);
    //상태
    const [isFavorite, setFavorite] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    //댓글
    const commentRef = useRef<HTMLTextAreaElement | null>(null);

    //Function
    const getFavoriteListResponse = (responseBody: GetFavoriteListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'NB') alert('존재하지 않는 게시물입니다.');
      if(code === 'DBE') alert('데이터베이스 오류 입니다.');
      if(code !== 'SU') return;

      const { favoriteList } = responseBody as GetFavoriteListResponseDto;
      setFavoriteList(favoriteList);

      if(!loginUser) {
        setFavorite(false);
        return;
      }
      const isFavorite = favoriteList.findIndex(favorite => favorite.email === loginUser.email) !== -1;
      setFavorite(isFavorite);
    }

    const getCommentListResponse = (responseBody: GetCommentListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'NB') alert('존재하지 않는 게시물입니다.');
      if(code === 'DBE') alert('데이터베이스 오류 입니다.');
      if(code !== 'SU') return;

      const { commentList } = responseBody as GetCommentListResponseDto;
      setCommentList(commentList);
    }
    
    //Event Handler
    const onShowFavoriteClickHandler = () => {
      setShowFavorite(!showFavorite);
    }
    const onShowCommentClickHandler = () => {
      setShowComment(!showComment);
    }
    const onFavoriteClickHandler = () => {
      setFavorite(!isFavorite);
    }
    const onCommentsubmitButtonClickHandler = () => {
      if(!comment) return;
        alert('!!!');
    }
    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value }= event.target;
      setComment(value);
      if(!commentRef.current) return;
      commentRef.current.style.height='auto';
      commentRef.current.style.height=`${commentRef.current.scrollHeight}px`;
    }
  

    //Effect 게시물이 바뀔때마다 좋아요,댓글 리스트 가져오기
    useEffect(() => {
      if(!boardNumber) return;
      getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
      getCommentListRequest(boardNumber).then(getCommentListResponse);
    }, [boardNumber])

    //Render
    return (
      <div id='board-detail-bottom'>
        <div className='board-detail-bottom-button-box'>
          <div className='board-detail-bottom-button-group'>
            <div className='icon-button' onClick={onFavoriteClickHandler}>
              {isFavorite ? 
              <div className='icon favorite-fill-icon'></div>
              : <div className='icon favorite-light-icon'></div>
              }
            </div>
            <div className='board-detail-bottom-button-text'>{`좋아요 ${favoriteList.length}`}</div>
            <div className='icon-button' onClick={onShowFavoriteClickHandler}>
              {showFavorite ?
              <div className='icon up-light-icon'></div>
              :<div className='icon down-light-icon'></div>
              }
            </div>
          </div>
          <div className='board-detail-bottom-button-group'>
            <div className='icon-button'>
              <div className='icon comment-icon'></div>
            </div>
            <div className='board-detail-bottom-button-text'>{`댓글 ${commentList.length}`}</div>
            <div className='icon-button' onClick={onShowCommentClickHandler}>
              {showComment ?
              <div className='icon up-light-icon'></div>
              :<div className='icon down-light-icon'></div>
              }
            </div>
          </div>
        </div>
        {showFavorite &&
        <div className='board-detail-bottom-favorite-box'>
          <div className='board-detail-bottom-favorite-container'>
            <div className='board-detail-bottom-favorite-title'>{'좋아요 '}<span className='emphasis'>{favoriteList.length}</span></div>
            <div className='board-detail-bottom-favorite-content'>
              {favoriteList.map(item => <FavoriteItem favoriteListItem={item} />)}
            </div>
          </div>
        </div>
        }
        {showComment &&
        <div className='board-detail-bottom-comment-box'>
          <div className='board-detail-bottom-comment-container'>
            <div className='board-detail-bottom-comment-title'>{'댓글 '}<span className='emphasis'>{commentList.length}</span></div>
            <div className='board-detail-bottom-comment-list-container'>
              {commentList.map(item => <CommentItem commentListItem={item} />)}
            </div>
          </div>
          <div className='divider'></div>
          <div className='board-detail-bottom-comment-pagination-box'>
            <Pagination />
          </div>
          {loginUser !== null &&
          <div className='board-detail-bottom-comment-input-box'>
            <div className='board-detail-bottom-comment-input-container'>
              <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler}  />
              <div className='board-detail-bottom-comment-button-box'>
                <div className={comment === '' ? 'disable-button' : 'black-button'} onClick={onCommentsubmitButtonClickHandler}>{'댓글달기'}</div>
              </div>
            </div>
          </div>
          }
        </div>
        }
      </div>
    )
  }

  // Effect
  let effectFlag = false;
  useEffect(() => {
    if(!boardNumber) return;
    if(effectFlag) return;

    increaseViewCountRequest(boardNumber).then(increaseViewCountResponse)
    effectFlag = true;
  },[boardNumber]);
  //아래를 위로 변경 함
  // let effectFlag = true;
  // useEffect(() => {
  //   if(!boardNumber) return;
  //   if(effectFlag) {
  //     effectFlag = false;
  //     return;
  //   }

  //   increaseViewCountRequest(boardNumber).then(increaseViewCountResponse)
  // },[boardNumber]);

  //Render
  return (
    <div id='board-detail-wrapper'>
      <div className='board-detail-container'>
        <BoardDetailTop/>
        <BoardDetailBottom/>
      </div>
    </div>
  )
}
