import {
  ResultCode,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "api/todolists-api";
import { AppThunk} from "app/store";
import { appActions } from "app/appReducer/AppReducer";
import { handleServerAppError, handleServerNetworkError} from "utils/errorUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsAction } from "features/TodolistsList/todolists-reducer";
import { clearTasksAndTodolists } from "common /common-actions";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";

const initialState: TasksStateType = {};
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasks.splice(index, 1);
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasks = state[action.payload.task.todoListId];
      tasks.unshift(action.payload.task);
    },
    updateTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        model: UpdateDomainTaskModelType;
        todolistId: string;
      }>
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
    // setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) => {
    //   state[action.payload.todolistId] = action.payload.tasks;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsAction.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsAction.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsAction.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return {};
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
        .addCase(fetchTasks.rejected, (state, action) => {

        })

  },
});


// thunks

const fetchTasks = createAppAsyncThunk<
    { tasks: TaskType[]; todolistId: string }, string>
("tasks/fetchTasks", async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
        dispatch(appActions.setAppLoadingStatus({ status: "loading" }));
        const res = await todolistsAPI.getTasks("todolistId");
        const tasks = res.data.items;
        dispatch(appActions.setAppLoadingStatus({ status: "succeeded" }));
        return { tasks, todolistId };
    } catch (e: any) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    }
});

// export const removeTask = createAppAsyncThunk(
//   "tasks/removeTask",
//   async (arg: { taskId: string; todolistId: string }, thunkAPI) => {
//     const { dispatch } = thunkAPI;
//     dispatch(appActions.setAppLoadingStatus({ status: "loading" }));
//     await todolistsAPI
//       .deleteTask(arg.todolistId, arg.taskId)
//       .then((res) => {
//         if (res.data.resultCode === ResultCode.SUCCESS) {
//           dispatch(tasksAction.removeTask({ taskId, todolistId }));
//           dispatch(appActions.setAppLoadingStatus({ status: "succeeded" }));
//         } else {
//           handleServerAppError(dispatch, res.data);
//         }
//       })
//       .catch((error) => {
//           handleServerNetworkError(dispatch, error);
//       });
//   }
// );
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppLoadingStatus({ status: "loading" }));
    todolistsAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === ResultCode.SUCCESS) {
          dispatch(tasksAction.removeTask({ taskId, todolistId }));
          dispatch(appActions.setAppLoadingStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(dispatch, res.data);
        }
      })
      .catch((error) => {
          handleServerNetworkError(dispatch, error);
      });
  };

export const addTask = createAppAsyncThunk<any,{ title: string; todolistId: string }>(
  "tasks/addTask",
  async (arg, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      try {
          dispatch(appActions.setAppLoadingStatus({ status: "loading" }));
          const res = await todolistsAPI
              .createTask(arg.todolistId, arg.title)
                  if (res.data.resultCode === ResultCode.SUCCESS) {
                      const task =res.data.data.item

                      dispatch(appActions.setAppLoadingStatus({status: "succeeded"}));
                      return {task}
                  } else {
                      handleServerAppError(dispatch, res.data);
                      return rejectWithValue(null)
                  }
              } catch(error: any) {
                  handleServerNetworkError(error, dispatch);
                  return rejectWithValue(null)
              }
  }
);

// export const addTaskTC =
//   (title: string, todolistId: string): AppThunk =>
//   (dispatch) => {
//     dispatch(appActions.setAppLoadingStatus({ status: "loading" }));
//     todolistsAPI
//       .createTask(todolistId, title)
//       .then((res) => {
//         if (res.data.resultCode === ResultCode.SUCCESS) {
//           dispatch(tasksAction.addTask({ task: res.data.data.item }));
//           dispatch(appActions.setAppLoadingStatus({ status: "succeeded" }));
//         } else {
//           handleServerAppError(dispatch, res.data);
//         }
//       })
//       .catch((error) => {
//           handleServerNetworkError(dispatch, error);
//       });
//   };
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(appActions.setAppLoadingStatus({ status: "loading" }));
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
          dispatch(tasksAction.updateTask({ taskId, model: domainModel, todolistId }));
          dispatch(appActions.setAppLoadingStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(dispatch, res.data);
        }
      })
      .catch((error) => {
          handleServerNetworkError(dispatch, error);
      });
  };

export const tasksReducer = slice.reducer;
export const tasksAction = slice.actions;
export const tasksThunk = { fetchTasks, addTask };
