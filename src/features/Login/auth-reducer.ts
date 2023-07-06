import { Dispatch } from 'redux'
import { SetAppErrorType, setAppLoadingStatus, SetLoadingStatusType } from '../../app/appReducer/AppReducer'
import {authAPI, ResultCode} from "../../api/todolists-api";
import {handlerServerNetworkError, handleServerAppError} from "../../utils/errorUtils";


type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetLoadingStatusType | SetAppErrorType

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState


export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) => ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const loginTC = (data: any) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppLoadingStatus('loading'))
    try{
        const result = await authAPI.login(data)
        if (result.data.resultCode === ResultCode.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppLoadingStatus("succeeded"))
        } else {
            handleServerAppError(dispatch, result.data)
        }
    } catch (e){
        const error = (e as { message: string })
        handlerServerNetworkError(dispatch, error)
    }


}


