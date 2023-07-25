import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
} from "./todolists-reducer";
import { addTaskTC, removeTaskTC, TasksStateType, updateTaskTC } from "./tasks-reducer";
import { TaskStatuses } from "api/todolists-api";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Navigate } from "react-router-dom";

export const TodolistsList: React.FC = () => {
  const todolists = useAppSelector<Array<TodolistDomainType>>((store) => store.todolists);
  const tasks = useAppSelector<TasksStateType>((store) => store.tasks);
  const isLoggedIn = useAppSelector((store) => store.auth.isLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchTodolistsTC());
  }, []);

  const removeTask = useCallback(function (id: string, todolistId: string) {
    dispatch(removeTaskTC(id, todolistId));
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(addTaskTC(title, todolistId));
  }, []);

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    dispatch(updateTaskTC(id, { status }, todolistId));
  }, []);

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    dispatch(updateTaskTC(id, { title: newTitle }, todolistId));
  }, []);

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    dispatch(changeTodolistFilterAC(todolistId, value));
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    dispatch(removeTodolistTC(id));
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(changeTodolistTitleTC(id, title));
  }, []);

  const addTodolist = useCallback((title: string) => {
    dispatch(addTodolistTC(title));
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
