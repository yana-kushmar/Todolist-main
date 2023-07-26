import {ResultCode, todolistsAPI, TodolistType} from "api/todolists-api";
import {appActions, RequestStatusType} from "app/appReducer/AppReducer";
import {handleServerAppError} from "utils/errorUtils";
import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";



export type FilterValuesType = "all" | "active" | "completed";


export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
    name: "todolists",
    initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id);
            if (index !== -1) state.splice(index, 1);
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"});
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id);
            if (index !== -1) state[index].title = action.payload.title;
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        },
        changeEntityStatus: (state, action: PayloadAction<{ todoId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todoId)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        }
    }

});


// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        todolistsAPI.getTodolists().then((res) => {
            dispatch(appActions.setAppLoadingStatus({status: "succeeded"}));
            dispatch(todolistsAction.setTodolists({todolists: res.data}));
        });
    };
};
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppLoadingStatus({status: "loading"}));
        dispatch(todolistsAction.changeEntityStatus({todoId: todolistId, entityStatus: "loading"}));
        todolistsAPI
            .deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(appActions.setAppLoadingStatus({status: "succeeded"}));
                    dispatch(todolistsAction.removeTodolist({id: todolistId}));
                } else {
                    handleServerAppError(dispatch, res.data);
                }
            })
            .catch(() => {
                dispatch(todolistsAction.changeEntityStatus({todoId: todolistId, entityStatus: "failed"}));
            });
    };
};
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppLoadingStatus({status: "loading"}));
        todolistsAPI.createTodolist(title).then((res) => {
            if (res.data.resultCode === ResultCode.SUCCESS) {
                dispatch(todolistsAction.addTodolist({todolist: res.data.data.item}));
                dispatch(appActions.setAppLoadingStatus({status: "succeeded"}));
            } else {
                handleServerAppError(dispatch, res.data);
            }
        });
    };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppLoadingStatus({status: "loading"}));
        todolistsAPI
            .updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(todolistsAction.changeTodolistTitle({ id: id, title: title }));
                    dispatch(appActions.setAppLoadingStatus({status: "succeeded"}));
                } else {
                    handleServerAppError(dispatch, res.data);
                }
            })
            .catch(() => {
                dispatch(todolistsAction.changeEntityStatus({todoId: id, entityStatus: "failed"}));
            });
    };
};

export const todolistsAction = slice.actions;
export const todolistsReducer = slice.reducer;

