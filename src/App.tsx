import React, { useState } from 'react';
import {latestBoardListMock, top3BoardListMock, commentListMock, favoriteListMock } from "mocks";
import BoardItem from 'components/BoardItem';
import Top3Item from 'components/Top3Item';
import CommentItem from 'components/CommentItem';
import FavoriteItem from 'components/FavoriteItem';
import InputBox from 'components/InputBox';

function App() {
 
  const [value, setValue] = useState<string>('');

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'center', gap: '24px'}}>
        <div>
          {latestBoardListMock.map(boardListItem => <BoardItem boardListItem={boardListItem}/>)}
        </div>
        <div>
          {top3BoardListMock.map(Top3ListItem => <Top3Item top3ListItem={Top3ListItem}/>)}
        </div>
        <div style={{padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px'}}>
          {commentListMock.map(commentListItem => <CommentItem commentListItem={commentListItem}/>)}
        </div>
        <div style={{display: 'flex', columnGap: '30px', rowGap: '20px'}}>
          {favoriteListMock.map(favoriteListItem => <FavoriteItem favoriteListItem={favoriteListItem}/>)}
        </div>
        <InputBox label='이메일' type='text' placeholder='이메일 주소를 입력해주세요' value={value} error={false} setValue={setValue} message='message!'  />
      </div>
    </>
  );
}

export default App;
