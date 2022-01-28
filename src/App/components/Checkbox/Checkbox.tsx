import React from 'react';

import './Checkbox.css';

interface ICheckboxProps {
    value?: boolean;
    title: string;
    onChange: (changed: boolean) => void;
}

function Checkbox(props: ICheckboxProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className={'checkbox'}>
            <input
                type="checkbox"
                ref={inputRef}
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
            />
            <div>{props.title}</div>
        </div>
    );
}

export { Checkbox };
