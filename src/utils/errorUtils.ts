
import { Dispatch } from "redux";
import { ResponseType } from "api/todolists-api";
import {appActions} from "app/appReducer/AppReducer";


export const handlerServerNetworkError = (
    dispatch: Dispatch,
    error: { message: string }) => {
  dispatch(appActions.setAppError({error: error.message ? error.message : "Some error occurred"}));
  dispatch(appActions.setAppLoadingStatus({status: "failed"}));
};

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
