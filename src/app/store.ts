import { tasksReducer } from "features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "features/TodolistsList/todolists-reducer";
import {AnyAction, combineReducers} from "redux";
import { appReducer } from "./appReducer/AppReducer";
import { authReducer } from "features/Login/auth-reducer";
import {configureStore, ThunkAction} from '@reduxjs/toolkit'
import thunkMiddleware, {  ThunkDispatch } from "redux-thunk";


const rootReducer = combineReducers({
  app: appReducer,
  tasks: tasksReducer,
  todolists: todolistsReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppThunk <ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

//@ts-ignore
window.store = store;
