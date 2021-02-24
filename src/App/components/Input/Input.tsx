import React from "react";

import "./Input.css";

interface IInputProps {
  value?: string;
  title: string;
  onChange: (newInput: string | null) => void;
}

function Input(props: IInputProps) {
  return (
    <div className={"input"}>
      <input
        defaultValue={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          props.onChange(event.target.value)
        }
      />
      <div>{props.title}</div>
    </div>
  );
}

export { Input };
