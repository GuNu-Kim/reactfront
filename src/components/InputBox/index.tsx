import React, { ChangeEvent, Dispatch, forwardRef, KeyboardEvent, SetStateAction } from 'react';
import './style.css';

interface Props{
    label: string;
    type: 'text' | 'password';
    error: boolean;
    placeholder: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    
    icon?: string;
    onButtonClick?: () => void;

    message?: string;

    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/*컴포넌트*/
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
    
    const {label, type, error, placeholder, value, setValue, icon, onButtonClick, message, onKeyDown} = props;

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setValue(value);
    };
    const onKeyDownhandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    };

    /*컴포넌트 랜더링*/
    return(
        <div className='inputbox'>
            <div className='inputbox-label'>{label}</div>
            <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
                <input ref={ref} type={type} className='input' placeholder={placeholder} value={value} onChange={onChangeHandler} onKeyDown={onKeyDownhandler}/>
                {onButtonClick !== undefined && (
                    <div className='icon-button'>
                        {icon !== undefined && (<div className={`icon ${icon}`}></div>)}
                    </div>
                )}
            </div>
            {message !== undefined && (<div className='inputbox-message'>{message}</div>)}
            
        </div>
    )
});

export default InputBox;