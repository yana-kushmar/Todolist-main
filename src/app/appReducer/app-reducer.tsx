
import {authActions} from "features/Login/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";

import {authAPI} from "api/auth-api";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";


const slice = createSlice({
  name: 'app',
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {

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
        .addMatcher(
            action => action.type.endsWith('/pending'),
            state => {
                state.status = 'loading'
            }
        )
        .addMatcher(
            action => action.type.endsWith('/rejected'),
            (state, action) => {
                const { payload, error } = action
                if (payload) {
                    if (payload.showGlobalError) {
                        state.error = payload.data.messages.length ? payload.data.messages[0] : 'Some error occurred'
                    }
                } else {
                    state.error = error.message ? error.message : 'Some error occurred'
                }
                state.status = 'failed'
            }
        )
        .addMatcher(
            action => action.type.endsWith('/fulfilled'),
            state => {
                state.status = 'succeeded'
            }
        )

  }
})


export const initializeApp =  createAppAsyncThunk<{isInitialized: boolean}, void>(
    'app/initializeApp',
    async (_, thunkAPI)=> {
        const {dispatch, rejectWithValue} = thunkAPI
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
            return {isInitialized: true}
        } else {

            return rejectWithValue({data: res.data, showGlobalError: true});
        }
    }

)




export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const appThunk = {initializeApp}