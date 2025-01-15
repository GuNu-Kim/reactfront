import React from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png'
import { CommentListItem } from 'types/interface';
import dayjs, { Dayjs } from 'dayjs';

interface Props{
    commentListItem: CommentListItem
}

//Component
export default function CommentItem({commentListItem}: Props) {

    //State
    const {nickname, profileImage, writeDatetime, content} = commentListItem;

    //Function
    const getElapsedTime = () => {
        const now = dayjs().add(9, 'hour'); //한국시간
        const writeTime = dayjs(writeDatetime); 
        
        const gap = now.diff(writeTime, 's');   //milliSeconds
        if(gap < 60) return `${gap}초 전`;
        if(gap < 3600) return `${Math.floor(gap / 60)}분 전`;
        if(gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;
        if(gap < 604800) return `${Math.floor(gap / 86400)}일 전`;
        if(gap < 604800) return `${Math.floor(gap / 604800)}주 전`;
        if(gap < 18144000) return `${Math.floor(gap / 604800)}달 전`;
        //if(gap < 217728000) return `${Math.floor(gap / 18144000)}년 전`;
         
        return `${Math.floor(gap / 18144000)}년 전`;
    }

    //Render
    return (
        <div className='comment-list-item'>
            <div className='comment-list-item-top'>
              <div className='comment-list-item-profile-box'>
                  <div className='comment-list-item-profile-image' style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
              </div>
              <div className='comment-list-item-nickname'>{nickname}</div>
              <div className='comment-list-item-divider'>{`\|`}</div>
              <div className='comment-list-item-time'>{getElapsedTime()}</div>
            </div>
            <div className='comment-list-item-main'>
              <div className='comment-list-item-content'>{content}</div>
            </div>
        </div>
    );
}