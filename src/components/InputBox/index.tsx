import React, { ChangeEvent, forwardRef, KeyboardEvent } from 'react';
import './style.css';


//interface
interface Props{
    label: string;
    type: 'text' | 'password';
    error: boolean;
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    
    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
    onButtonClick?: () => void;

    message?: string;

    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

//component
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
    
    //state
    const {label, type, error, placeholder, value, onChange, icon, onButtonClick, message, onKeyDown} = props;
    
    //event handler
    const onKeyDownhandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    };

    //render
    return(
        <div className='inputbox'>
            <div className='inputbox-label'>{label}</div>
            <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
                <input ref={ref} type={type} className='input' placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDownhandler}/>
                {onButtonClick !== undefined && (
                    <div className='icon-button' onClick={onButtonClick}>
                        {icon !== undefined && (<div className={`icon ${icon}`}></div>)}
                    </div>
                )}
            </div>
            {message !== undefined && (<div className='inputbox-message'>{message}</div>)}
            
        </div>
    )
});

export default InputBox;