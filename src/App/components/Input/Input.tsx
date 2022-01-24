import React from 'react'

import './Input.css'

interface IInputProps {
    type: 'text' | 'number'
    title?: string
    value?: string
    placeholder?: string
    onChange: (newInput: string | null) => void
}

function Input(props: IInputProps) {
    return (
        <div className={'input'}>
            <input
                type={props.type}
                placeholder={props.placeholder}
                defaultValue={props.value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    props.onChange(event.target.value)
                }
            />
            {props.title && <div>{props.title}</div>}
        </div>
    )
}

export { Input }
