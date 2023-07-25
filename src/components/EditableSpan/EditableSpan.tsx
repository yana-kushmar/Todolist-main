import React, { ChangeEvent, memo, useState } from "react";
import TextField from "@mui/material/TextField";

export type EditableSpanPropsType = {
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
};

export const EditableSpan = memo(function (props: EditableSpanPropsType) {
  let [editMode, setEditMode] = useState(false);
  let [title, setTitle] = useState(props.value);

  const activateEditMode = () => {
    if (!props.disabled) {
      setEditMode(true);
      setTitle(props.value);
    }
  };
  const activateViewMode = () => {
    setEditMode(false);
    props.onChange(title);
  };
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  return editMode ? (
    <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} />
  ) : (
    <span onDoubleClick={activateEditMode}>{props.value}</span>
  );
});
