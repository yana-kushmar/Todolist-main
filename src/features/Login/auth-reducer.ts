import { Dispatch } from "redux";
import {
  SetAppErrorType,
  setAppLoadingStatus,
  setIsInitializedAC,
  SetIsInitializedType,
  SetLoadingStatusType,
} from "app/appReducer/AppReducer";
import { authAPI, ResultCode } from "api/todolists-api";
import { handlerServerNetworkError, handleServerAppError } from "utils/errorUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }

  }
});

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions
export const authActions = slice.actions

type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetLoadingStatusType | SetAppErrorType | SetIsInitializedType;



// export const setIsLoggedInAC = (value: boolean) => ({ type: "login/SET-IS-LOGGED-IN", value } as const);

export const loginTC = (data: any) => async (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppLoadingStatus("loading"));
  try {
    const result = await authAPI.login(data);
    if (result.data.resultCode === ResultCode.SUCCESS) {
      dispatch(setIsLoggedInAC({isLoggedIn: true}));
      dispatch(setAppLoadingStatus("succeeded"));
    } else {
      handleServerAppError(dispatch, result.data);
    }
  } catch (e) {
    const error = e as { message: string };
    handlerServerNetworkError(dispatch, error);
  }
};

export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppLoadingStatus("loading"));
  try {
    const result = await authAPI.me();
    if (result.data.resultCode === ResultCode.SUCCESS) {
      dispatch(setIsLoggedInAC({isLoggedIn: true}));
      dispatch(setIsInitializedAC(true));
      dispatch(setAppLoadingStatus("succeeded"));
    } else {
      handleServerAppError(dispatch, result.data);
    }
  } catch (e) {
    const error = e as { message: string };
    handlerServerNetworkError(dispatch, error);
  } finally {
    dispatch(setIsInitializedAC(true));
  }
};
export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppLoadingStatus("loading"));
  try {
    const result = await authAPI.logOut();
    if (result.data.resultCode === ResultCode.SUCCESS) {
      dispatch(setIsLoggedInAC({isLoggedIn: false}));
      dispatch(setAppLoadingStatus("succeeded"));
    } else {
      handleServerAppError(dispatch, result.data);
    }
  } catch (e) {
    const error = e as { message: string };
    handlerServerNetworkError(dispatch, error);
  }
};
