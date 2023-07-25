import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType,
} from "./todolists-reducer";
import {
  ResultCode,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "app/store";
import {
  AppActionsType,
  RequestStatusType,
  SetAppErrorType,
  setAppLoadingStatus,
} from "app/appReducer/AppReducer";
import { handlerServerNetworkError, handleServerAppError } from "utils/errorUtils";


const initialState: TasksStateType = {};

type TasksActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
  | ReturnType<typeof setTasksAC>
  | SetAppErrorType;

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: TaskDomainType[];
};
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType;
};

type ErrorType = {
  statusCode: number;
  message: string[];
  error: string;
};

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return { ...state, [action.todolistId]: state[action.todolistId].filter((t) => t.id !== action.taskId) };
    case "ADD-TASK":
      return {
        ...state,
        [action.task.todoListId]: [{ ...action.task, entityStatus: "idle" }, ...state[action.task.todoListId]],
      };
    case "UPDATE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, ...action.model } : t
        ),
      };
    case "ADD-TODOLIST":
      return { ...state, [action.todolist.id]: [] };
    case "REMOVE-TODOLIST":
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    case "SET-TODOLISTS": {
      const copyState = { ...state };
      action.todolists.forEach((tl) => {
        copyState[tl.id] = [];
      });
      return copyState;
    }
    case "SET-TASKS":
      return { ...state, [action.todolistId]: action.tasks.map((task) => ({ ...task, entityStatus: "idle" })) };
    default:
      return state;
  }
};

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({ type: "REMOVE-TASK", taskId, todolistId } as const);
export const addTaskAC = (task: TaskType) => ({ type: "ADD-TASK", task } as const);
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
  ({ type: "UPDATE-TASK", model, todolistId, taskId } as const);
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({ type: "SET-TASKS", tasks, todolistId } as const);

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<TasksActionsType | AppActionsType>) => {
  dispatch(setAppLoadingStatus("loading"));
  todolistsAPI.getTasks(todolistId).then((res) => {
    dispatch(setTasksAC(res.data.items, todolistId));
    dispatch(setAppLoadingStatus("succeeded"));
  });
};
export const removeTaskTC =
  (taskId: string, todolistId: string) => (dispatch: Dispatch<TasksActionsType | AppActionsType>) => {
    dispatch(setAppLoadingStatus("loading"));
    todolistsAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCESS) {
          dispatch(removeTaskAC(taskId, todolistId));
          dispatch(setAppLoadingStatus("succeeded"));
        } else {
          handleServerAppError(dispatch, res.data);
        }
      })
      .catch((error) => {
        handlerServerNetworkError(dispatch, error);
      });
  };

export const addTaskTC =
  (title: string, todolistId: string) => (dispatch: Dispatch<TasksActionsType | AppActionsType>) => {
    dispatch(setAppLoadingStatus("loading"));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCESS) {
          dispatch(addTaskAC(res.data.data.item));
          dispatch(setAppLoadingStatus("succeeded"));
        } else {
          handleServerAppError(dispatch, res.data);
        }
      })
      .catch((error) => {
        handlerServerNetworkError(dispatch, error);
      });
  };
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: Dispatch<TasksActionsType | AppActionsType>, getState: () => AppRootStateType) => {
    dispatch(setAppLoadingStatus("loading"));
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);

    const apiModel: UpdateTaskModelType = {
      deadline: task!.deadline,
      description: task!.description,
      priority: task!.priority,
      startDate: task!.startDate,
      title: task!.title,
      status: task!.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCESS) {
          dispatch(updateTaskAC(taskId, domainModel, todolistId));
          dispatch(setAppLoadingStatus("succeeded"));
        } else {
          handleServerAppError(dispatch, res.data);
        }
      })
      .catch((error) => {
        handlerServerNetworkError(dispatch, error);
      });
  };
