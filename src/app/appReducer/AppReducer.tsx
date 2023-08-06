import { authAPI } from "api/todolists-api";
import {authActions} from "features/Login/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";
import {handleServerAppError, handleServerNetworkError} from "utils/errorUtils";

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
  },
  extraReducers: (builder) => {
    builder
        .addCase(initializeApp.fulfilled, (state, action) => {
          state.isInitialized = action.payload.isInitialized
        })

  }
})


export const initializeApp =  createAppAsyncThunk<{isInitialized: boolean}, void>(
    'app/initializeApp',
    async (_, thunkAPI)=> {
      const {dispatch, rejectWithValue} = thunkAPI
      try {
        const res = await authAPI.me()
          if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
            return {isInitialized: true}
          } else {

            return rejectWithValue(null);
          }
      } catch (err) {
        const error = err as { message: string };
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
      }
      }

)




export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const appThunk = {initializeApp}