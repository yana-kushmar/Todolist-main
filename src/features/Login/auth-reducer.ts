import { LoginType, ResultCode} from "api/todolists-api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RequestStatusType} from "app/appReducer/app-reducer";

import { clearTasksAndTodolists } from "common /common-actions";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import {authAPI} from "api/auth-api";


const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setIsLoggedIn:  (state, action:PayloadAction<{isLoggedIn:  boolean}>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },

  },
  extraReducers: (builder) => {
    builder
        .addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    })

        .addCase(logOut.fulfilled, (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
        })

  },
});

export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType>("auth/login", async (data, {rejectWithValue}) => {
    const result = await authAPI.login(data);
    if (result.data.resultCode === ResultCode.SUCCESS) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue({ data: result.data, showGlobalError: true });
    }
});

export const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
    'auth/logOuth',
    async (_ , thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
        const result = await authAPI.logOut();
        if (result.data.resultCode === ResultCode.SUCCESS) {
          dispatch(clearTasksAndTodolists());
          return { isLoggedIn: false }
        } else {
          return rejectWithValue({ data: result.data, showGlobalError: true });
        }
    }
)




export const authReducer = slice.reducer;
export const authActions = slice.actions;

export const authThunk = { login, logOut };
