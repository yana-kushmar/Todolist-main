import {setErrorAC, SetErrorType, setLoadingStatus, SetLoadingStatusType} from "../app/appReducer/AppReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

type ErrorUtilsDispatchType = SetLoadingStatusType | SetErrorType


export const handlerServerNetworkError = (dispatch: Dispatch<ErrorUtilsDispatchType>, error: string) => {
    dispatch(setErrorAC(error))
    dispatch(setLoadingStatus("failed"))
}

export const handleServerAppError = <T>(dispatch: Dispatch<ErrorUtilsDispatchType>, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC('Some error'))
    }
    dispatch(setLoadingStatus('failed'))
}