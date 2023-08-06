import {ResultCode, todolistsAPI, TodolistType} from "api/todolists-api";
import {appActions, RequestStatusType} from "app/appReducer/AppReducer";
import {handleServerAppError, handleServerNetworkError} from "utils/errorUtils";
import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common /common-actions";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";
import {thunkTryCatch} from "utils/thunk-try-catch";



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
        changeTodolistFilter: (state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        },
        changeEntityStatus: (state, action: PayloadAction<{ todoId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.todoId)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },

    },
    extraReducers: builder => {
        builder
            .addCase(clearTasksAndTodolists.type, () => {
                return []

            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
                
            })
            .addCase(removeTodolist.fulfilled, (state, action)=> {
                const index = state.findIndex((todo) => todo.id === action.payload.id);
                if (index !== -1) state.splice(index, 1);
            })
            .addCase(addTodolist.fulfilled, (state, action)=> {
                state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"});
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action)=> {
                const index = state.findIndex((todo) => todo.id === action.payload.id);
                if (index !== -1) state[index].title = action.payload.title;
            })
    }

});


// thunks

export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todolists/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppLoadingStatus({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();
      dispatch(appActions.setAppLoadingStatus({ status: "succeeded" }));
      return {todolists: res.data};
    } catch (err) {
      const error = err as { message: string };
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTodolist = createAppAsyncThunk<{id: string},  string>(
    'todolists/removeTodolist', 
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppLoadingStatus({status: "loading"}));
            dispatch(todolistsAction.changeEntityStatus({todoId: todolistId, entityStatus: "loading"}));
            const res = await todolistsAPI.deleteTodolist(todolistId );
            if (res.data.resultCode === ResultCode.SUCCESS) {
                dispatch(appActions.setAppLoadingStatus({status: "succeeded"}));
                return {id: todolistId}
            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null)
            }
        }
        catch (err){
            const error = err as { message: string };
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);
        }
    }
)




export const addTodolist = createAppAsyncThunk<{todolist: TodolistType}, string>(
    'todolists/addTodolist',
    async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistsAPI
                .createTodolist(title)
            if (res.data.resultCode === ResultCode.SUCCESS) {
                return {todolist: res.data.data.item}

            } else {
                handleServerAppError(dispatch, res.data);
                return rejectWithValue(null);
            }

        })

    })
export const changeTodolistTitle = createAppAsyncThunk<any, {id: string, title: string}>(
    'todolists/changeTodolistTitle',
    async (arg, thunkAPI)=> {
        const {dispatch, rejectWithValue} =thunkAPI
        try {
            dispatch(appActions.setAppLoadingStatus({status: "loading"}));
           const res = await todolistsAPI
                .updateTodolist(arg.id, arg.title)

                    if (res.data.resultCode === ResultCode.SUCCESS) {
                        dispatch(appActions.setAppLoadingStatus({status: "succeeded"}));
                        return {id: arg.id, title: arg.title}
                    } else {
                        handleServerAppError(dispatch, res.data);
                        return rejectWithValue(null);
                    }
        }
        catch (error: any){
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);

        }

    }
)
// export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppLoadingStatus({status: "loading"}));
//         todolistsAPI
//             .updateTodolist(id, title)
//             .then((res) => {
//                 if (res.data.resultCode === ResultCode.SUCCESS) {
//                     dispatch(todolistsAction.changeTodolistTitle({id: id, title: title}));
//                     dispatch(appActions.setAppLoadingStatus({status: "succeeded"}));
//                 } else {
//                     handleServerAppError(dispatch, res.data);
//                 }
//             })
//             .catch(() => {
//                 dispatch(todolistsAction.changeEntityStatus({todoId: id, entityStatus: "failed"}));
//             });
//     };
// };

export const todolistsAction = slice.actions;
export const todolistsReducer = slice.reducer;

export const todolistsThunk = {fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle}


