import { AppDispatch, AppRootStateType } from 'app/store';
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';

import {appActions} from "app/appReducer/AppReducer";
import {handleServerNetworkError} from "utils/errorUtils";
import {ResponseType} from "common /common-types";

export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null>,
    logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppLoadingStatus({ status: "loading" }));
    try {
        return await logic();
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    } finally {
        dispatch(appActions.setAppLoadingStatus({ status: "idle" }));
    }
};