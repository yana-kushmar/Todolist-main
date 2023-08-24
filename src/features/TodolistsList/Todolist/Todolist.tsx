import React, {memo, useCallback, useEffect} from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { Task } from "./Task/Task";
import { TaskStatuses, TaskType } from "api/todolists-api";
import { FilterValuesType } from "../todolists-reducer";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import { RequestStatusType } from "app/appReducer/app-reducer";
import {tasksThunk} from "features/TodolistsList/tasks-reducer";

import {useAppDispatch} from "app/appReducer/useAppDispatch";
import {FilterTasksButtons} from "features/TodolistsList/Todolist/FilterTasksButton/FilterTasksButton";

type PropsType = {
  id: string;
  title: string;
  tasks: Array<TaskType>;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const Todolist = memo(function (props: PropsType) {
  const dispatch = useAppDispatch()
   useEffect(() => {
    dispatch(tasksThunk.fetchTasks(props.id))
   }, []);



  const addTask = useCallback(
    (title: string) => {
      dispatch(tasksThunk.addTask({ todolistId: props.id, title }));
    },
    [ props.id]
  );

  const removeTodolist = () => {
    props.removeTodolist(props.id);
  };
  const changeTodolistTitle = useCallback(
    (title: string) => {
      props.changeTodolistTitle(props.id, title);
    },
    [props.id, props.changeTodolistTitle]
  );

  const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.id, props.changeFilter]);
  const onActiveClickHandler = useCallback(
    () => props.changeFilter("active", props.id),
    [props.id, props.changeFilter]
  );
  const onCompletedClickHandler = useCallback(
    () => props.changeFilter("completed", props.id),
    [props.id, props.changeFilter]
  );

  let tasksForTodolist = props.tasks || [];

  if (props.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} onChange={changeTodolistTitle} disabled={props.entityStatus === "loading"} />
        <IconButton onClick={removeTodolist} disabled={props.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={props.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.id}

          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
          <FilterTasksButtons  onAllClickHandler={onAllClickHandler}
                               onActiveClickHandler={onActiveClickHandler}
                               onCompletedClickHandler={onCompletedClickHandler}
                               filter={props.filter}

          />
      </div>
    </div>
  );
});
