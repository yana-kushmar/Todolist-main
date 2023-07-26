import { authAPI } from "api/todolists-api";
import {authActions} from "features/Login/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";


const slice = createSlice({
  name: 'app',
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppLoadingStatus: (state, action:PayloadAction<{status:  RequestStatusType}>) => {
      state.status = action.payload.status
  },
    setAppError: (state, action: PayloadAction<{error: string | null}>) => {
      state.error = action.payload.error
    },
    setAppInitialized: (state, action: PayloadAction<{isInitialized: boolean}> ) => {
      state.isInitialized = action.payload.isInitialized
    }
  }
})


export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then(res => {
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInAC({isLoggedIn: true}));
    } else {
    }
    dispatch(appActions.setAppInitialized({isInitialized: true}));
  })
}

export const appReducer = slice.reducer;
export const appActions = slice.actions;