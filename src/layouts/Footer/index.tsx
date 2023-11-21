import React from 'react'
import './style.css';

//component
export default function Footer() {
  
  //event handler
  const onInstaIconButtonClickHandler = () =>{
    window.open('https://www.instagram.com');
  }
  const onNaverBlogIconButtonClickHandler = () =>{
    window.open('https://blog.naver.com');
  }

  //render
  return (
    <div className='footer'>
      <div className='footer-container'>
        <div className='footer-top'>
          <div className='footer-logo-box'>
            <div className='icon-box'>
              <div className='icon logo-light-icon'></div>
            </div>
            <div className='footer-logo-text'>{'Kuns Board'}</div>
          </div>
          <div className='footer-link-box'>
            <div className='footer-email-link'>{'kkk@gmail.com'}</div>
            <div className='icon-button' onClick={onInstaIconButtonClickHandler}>
              <div className='icon insta-icon'></div>
            </div>
            <div className='icon-button' onClick={onNaverBlogIconButtonClickHandler}>
              <div className='icon naver-blog-icon'></div>
            </div>
          </div>
        </div>

        <div className='footer-bottom'>
          <div className='footer-copyright'></div>
        </div>
      </div>
    </div>
  )
}
