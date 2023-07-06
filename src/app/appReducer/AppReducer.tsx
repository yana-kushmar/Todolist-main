

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetLoadingStatusType = ReturnType<typeof setAppLoadingStatus>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type AppActionsType = SetLoadingStatusType | SetAppErrorType


 const initialState = {
    status: 'idle' as RequestStatusType,
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

export const setAppLoadingStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)




