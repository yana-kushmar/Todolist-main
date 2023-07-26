
import {AppRootStateType} from "app/store";

export const selectTodolists = ((store: AppRootStateType) => store.todolists);
export const selectTasks = ((store: AppRootStateType) => store.tasks);
