import React, { useCallback, useEffect } from "react";

import {FilterValuesType, todolistsAction, todolistsThunk} from "./todolists-reducer";
import { tasksThunk } from "./tasks-reducer";
import { TaskStatuses } from "api/todolists-api";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/Login/auth.selectors";
import { selectTasks, selectTodolists } from "features/TodolistsList/task-todo-selectors";
import { useAppDispatch } from "app/appReducer/useAppDispatch";

export const TodolistsList: React.FC = () => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(todolistsThunk.fetchTodolists());
  }, []);

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    dispatch(tasksThunk.removeTask({ taskId, todolistId }));
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunk.addTask({ todolistId, title }));
  }, []);

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    dispatch(tasksThunk.updateTask({ taskId, todolistId, domainModel: { status } }));
  }, []);

  const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
    dispatch(tasksThunk.updateTask({ taskId, todolistId, domainModel: { title: newTitle } }));
  }, []);

  const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
    dispatch(todolistsAction.changeTodolistFilter({ todolistId, filter }));
  }, []);

  const removeTodolist = useCallback(function (todolistsId: string) {
    dispatch(todolistsThunk.removeTodolist(todolistsId));
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(todolistsThunk.changeTodolistTitle({ id, title }));
  }, []);

  const addTodolist = useCallback((title: string) => {
    dispatch(todolistsThunk.addTodolist(title));
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  id={tl.id}
                  title={tl.title}
                  entityStatus={tl.entityStatus}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  filter={tl.filter}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
