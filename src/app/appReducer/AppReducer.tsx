export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type SetLoadingStatusType = ReturnType<typeof setAppLoadingStatus>;
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>;
export type SetIsInitializedType = ReturnType<typeof setIsInitializedAC>;
export type AppActionsType = SetLoadingStatusType | SetAppErrorType | SetIsInitializedType;

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};

export type InitialStateType = {
  status: RequestStatusType;
  error: null | string;
  isInitialized: boolean;
};

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-INITIALIZED":
      return { ...state, isInitialized: action.isInitialized };

    default:
      return state;
  }
};

export const setAppLoadingStatus = (status: RequestStatusType) => ({ type: "APP/SET-STATUS", status } as const);
export const setAppErrorAC = (error: string | null) => ({ type: "APP/SET-ERROR", error } as const);
export const setIsInitializedAC = (isInitialized: boolean) => ({ type: "APP/SET-INITIALIZED", isInitialized } as const);
