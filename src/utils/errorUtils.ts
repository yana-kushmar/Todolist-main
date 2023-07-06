import {setAppErrorAC, SetAppErrorType, setAppLoadingStatus, SetLoadingStatusType} from "../app/appReducer/AppReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

type ErrorUtilsDispatchType = SetLoadingStatusType | SetAppErrorType


export const handlerServerNetworkError = (dispatch: Dispatch<ErrorUtilsDispatchType>, error: { message: string }) => {
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppLoadingStatus("failed"))
}

export const handleServerAppError = <T>(dispatch: Dispatch<ErrorUtilsDispatchType>, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error'))
    }
    dispatch(setAppLoadingStatus('failed'))
}