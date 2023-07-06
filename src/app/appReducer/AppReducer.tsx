import exp from "constants";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetLoadingStatusType = ReturnType<typeof setLoadingStatus>
export type SetErrorType = ReturnType<typeof setErrorAC>
export type AppActionsType = SetLoadingStatusType | SetErrorType


 const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}

export type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}

        default:
            return state
    }
}

export const setLoadingStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)




