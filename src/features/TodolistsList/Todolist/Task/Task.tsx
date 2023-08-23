import React, { ChangeEvent, memo, useCallback } from "react";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { TaskStatuses, TaskType } from "api/todolists-api";

import { Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import {tasksThunk} from "features/TodolistsList/tasks-reducer";
import {useAppDispatch} from "app/appReducer/useAppDispatch";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;


};
export const Task = memo((props: TaskPropsType) => {
    const dispatch = useAppDispatch()

    const removeTaskHandler = useCallback(function () {
        dispatch(tasksThunk.removeTask({ taskId: props.task.id, todolistId: props.todolistId }))},
            []
    )

  const changeTaskStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked;
        dispatch(tasksThunk.updateTask({ taskId: props.task.id, todolistId: props.todolistId, domainModel: { status:newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, } })
      );
    },
    []
  );


  const changeTaskTitleHandler = useCallback(
    (newTitle: string) => {
        dispatch(tasksThunk.updateTask({ taskId: props.task.id, todolistId: props.todolistId, domainModel: { title: newTitle } }))

    },
    []
  );

  return (
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={props.task.status === TaskStatuses.Completed} color="primary" onChange={changeTaskStatusHandler} />

      <EditableSpan value={props.task.title} onChange={changeTaskTitleHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
