import {ResultCode, todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
    AppActionsType,
    RequestStatusType,
    setLoadingStatus,

} from "../../app/appReducer/AppReducer";
import {handleServerAppError} from "../../utils/errorUtils";


export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;

export type FilterValuesType = 'all' | 'active' | 'completed';
type TodolistActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeEntityStatusAC>
    | SetTodolistsActionType



export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'CHANGE-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todoId ? {...tl, entityStatus: action.entityStatus } : tl)
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const changeEntityStatusAC = (todoId: string, entityStatus: RequestStatusType ) => ({type: 'CHANGE-ENTITY-STATUS', todoId, entityStatus} as const)

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<TodolistActionsType | AppActionsType>) => {
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setLoadingStatus('succeeded'))
                dispatch(setTodolistsAC(res.data))
            })


    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<TodolistActionsType | AppActionsType>) => {
        dispatch(setLoadingStatus('loading'))
        dispatch(changeEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(setLoadingStatus('succeeded'))
                    dispatch(removeTodolistAC(todolistId))
                }else {
                    handleServerAppError(dispatch, res.data)
                }})
            .catch(() => {
                dispatch(changeEntityStatusAC(todolistId, 'failed'))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<TodolistActionsType | AppActionsType>) => {
        dispatch(setLoadingStatus('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS){
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setLoadingStatus('succeeded'))
                } else {
                   handleServerAppError(dispatch, res.data)
                }
            })

    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<TodolistActionsType | AppActionsType>) => {
        dispatch(setLoadingStatus('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(setLoadingStatus('succeeded'))
                } else {
                    handleServerAppError(dispatch, res.data)
                }})
            .catch(() => {
                dispatch(changeEntityStatusAC(id, 'failed'))
            })

    }
}



