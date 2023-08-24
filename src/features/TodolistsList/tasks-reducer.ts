import {
  AddTaskArgType,
  ResultCode,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskArgType,
  UpdateTaskModelType,
} from "api/todolists-api";


import { createSlice} from "@reduxjs/toolkit";
import { todolistsAction } from "features/TodolistsList/todolists-reducer";
import { clearTasksAndTodolists } from "common /common-actions";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";

import {tasksAPI} from "api/tasks-api";


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
        .addCase(removeTask.fulfilled, (state, action) => {
          const tasks = state[action.payload.todolistId];
          const index = tasks.findIndex((task) => task.id === action.payload.taskId);
          if (index !== -1) tasks.splice(index, 1);
        })
      .addCase(clearTasksAndTodolists.type, () => {
        return {};
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel };
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {});
  },
});

// thunks

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId) => {
      const res = await tasksAPI.getTasks(todolistId);
      const tasks = res.data.items;
      return { tasks, todolistId };

  }
);

export const removeTask = createAppAsyncThunk<any, { taskId: string; todolistId: string }>(
  "tasks/removeTask",
  async (arg, {rejectWithValue}) => {
      const res = await tasksAPI.deleteTask(arg.todolistId, arg.taskId);
      if (res.data.resultCode === ResultCode.SUCCESS) {
        return { ...arg }
      } else {
        return rejectWithValue({ data: res.data, showGlobalError: true });
      }

  }
);


export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  "tasks/addTask",
  async (arg, {rejectWithValue}) => {
      const res = await tasksAPI.createTask(arg);
      if (res.data.resultCode === ResultCode.SUCCESS) {
        const task = res.data.data.item;
        return { task };
      } else {
        return rejectWithValue({ data: res.data, showGlobalError: true });
      }

  }
);


export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const {  rejectWithValue, getState } = thunkAPI;
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
      if (!task) {
        console.warn("tasks not found in the state");
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      };

      const res = await tasksAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (res.data.resultCode === ResultCode.SUCCESS) {
        return arg;
      } else {
        return rejectWithValue({data: res.data, showGlobalError: true});
      }
    }
);

export const tasksReducer = slice.reducer;
export const tasksAction = slice.actions;
export const tasksThunk = { fetchTasks, addTask, updateTask, removeTask };
