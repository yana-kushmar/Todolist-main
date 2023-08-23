import React, { useCallback, useEffect } from "react";

import {FilterValuesType, todolistsAction, todolistsThunk} from "./todolists-reducer";
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
                  changeFilter={changeFilter}
                  filter={tl.filter}
                  removeTodolist={removeTodolist}
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
