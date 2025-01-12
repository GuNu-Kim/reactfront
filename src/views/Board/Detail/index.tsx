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
import boardMock from 'mocks/board.mock';

//component
export default function BoardDetail() {
  //state
  const {boardNumber} = useParams();
  const {loginUser } = useLoginUserStore();

  //function
  const navigator = useNavigate();

  const BoardDetailTop = () => {

    //state
    const[board, setBoard] = useState<Board | null>(null);
    const[showMore, setShowMore] = useState<boolean>(false);

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
      setBoard(boardMock);
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
              <div className='board-detail-writer-date'>{board.writeDateTime}</div>
            </div>
            <div className='icon-button' onClick={onMoreButtonClickHandler}>
              <div className='icon more-icon'></div>
            </div>
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
      setFavoriteList(favoriteListMock);
      setCommentList(commentListMock);
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
          <div className='board-detail-bottom-comment-input-box'>
            <div className='board-detail-bottom-comment-input-container'>
              <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler}  />
              <div className='board-detail-bottom-comment-button-box'>
                <div className={comment === '' ? 'disable-button' : 'black-button'} onClick={onCommentsubmitButtonClickHandler}>{'댓글달기'}</div>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    )
  }

  //render
  return (
    <div id='board-detail-wrapper'>
      <div className='board-detail-container'>
        <BoardDetailTop/>
        <BoardDetailBottom/>
      </div>
    </div>
  )
}
