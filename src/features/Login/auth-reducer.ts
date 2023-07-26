import { authAPI, ResultCode } from "api/todolists-api";
import { handlerServerNetworkError, handleServerAppError } from "utils/errorUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import {appActions} from "app/appReducer/AppReducer";
import {todolistsAction} from "features/TodolistsList/todolists-reducer";
import {tasksAction} from "features/TodolistsList/tasks-reducer";
import {clearTasksAndTodolists} from "common /common-actions";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const loginTC =
  (data: any): AppThunk =>
  async (dispatch) => {
    dispatch(appActions.setAppLoadingStatus({status:"loading"}));
    try {
      const result = await authAPI.login(data);
      if (result.data.resultCode === ResultCode.SUCCESS) {
        dispatch(authActions.setIsLoggedInAC({ isLoggedIn: true }));
        dispatch(appActions.setAppLoadingStatus({status:"succeeded"}));
      } else {
        handleServerAppError(dispatch, result.data);
      }
    } catch (e) {
      const error = e as { message: string };
      handlerServerNetworkError(dispatch, error);
    }
  };

export const meTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppLoadingStatus({status:"loading"}));
  try {
    const result = await authAPI.me();
    if (result.data.resultCode === ResultCode.SUCCESS) {
      dispatch(authActions.setIsLoggedInAC({ isLoggedIn: true }));
      dispatch(appActions.setAppInitialized({isInitialized: true}));
      dispatch(appActions.setAppLoadingStatus({status:"succeeded"}));
    } else {
      handleServerAppError(dispatch, result.data);
    }
  } catch (e) {
    const error = e as { message: string };
    handlerServerNetworkError(dispatch, error);
  } finally {
    dispatch(appActions.setAppInitialized({isInitialized:true}));
  }
};
export const logOutTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppLoadingStatus({status:"loading"}));
  try {
    const result = await authAPI.logOut();
    if (result.data.resultCode === ResultCode.SUCCESS) {
      dispatch(authActions.setIsLoggedInAC({ isLoggedIn: false }));
     dispatch(clearTasksAndTodolists())
      dispatch(appActions.setAppLoadingStatus({status:"succeeded"}));
    } else {
      handleServerAppError(dispatch, result.data);
    }
  } catch (e) {
    const error = e as { message: string };
    handlerServerNetworkError(dispatch, error);
  }
};

export const authReducer = slice.reducer;
export const authActions = slice.actions;
