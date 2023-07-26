import {AppRootStateType} from "app/store";




export const selectIsInitialized = (store: AppRootStateType) => store.app.isInitialized
export const selectStatus = ((store: AppRootStateType) => store.app.status);
export const selectError = ((store: AppRootStateType) => store.app.error);

