import { tasksReducer } from "features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "features/TodolistsList/todolists-reducer";
import { AnyAction} from "redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "./appReducer/AppReducer";
import { authReducer } from "features/Login/auth-reducer";
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";


const rootReducer = {
  app: appReducer,
  tasks: tasksReducer,
  todolists: todolistsReducer,
  auth: authReducer,
};

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
