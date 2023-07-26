import {AppRootStateType} from "app/store";

export const selectIsLoggedIn = (store: AppRootStateType) => store.auth.isLoggedIn
