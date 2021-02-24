import React from "react";

import "./Checkbox.css";

interface ICheckboxProps {
  title: string;
  onChange: (changed: boolean) => void;
}

function Checkbox(props: ICheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={"checkbox"}>
      <input
        type="checkbox"
        ref={inputRef}
        onChange={() => props.onChange(true)}
      />
      <div>{props.title}</div>
    </div>
  );
}

export { Checkbox };
