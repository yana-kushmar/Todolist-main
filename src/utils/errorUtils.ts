import { Dispatch } from "redux";
import { ResponseType } from "api/todolists-api";
import {appActions} from "app/appReducer/AppReducer";
import axios, {AxiosError} from "axios";
import {AppDispatch} from "app/store";



export const handleServerAppError = <T>(
    dispatch: Dispatch,
    data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({error: data.messages[0]}));
  } else {
    dispatch(appActions.setAppError({error: "Some error"}));
  }
  dispatch(appActions.setAppLoadingStatus({status: "failed"}));
};

export const handleServerNetworkError = (e: unknown, dispatch: AppDispatch) => {
  const err = e as Error | AxiosError<{ error: string }>
  if (axios.isAxiosError(err)) {
    const error = err.message ? err.message : 'Some error occurred'
    dispatch(appActions.setAppError({error}))
  } else {
    dispatch(appActions.setAppError({error: `Native error ${err.message}`}))
  }
  dispatch(appActions.setAppLoadingStatus({status: 'failed'}))
}