import axios, { AxiosResponse } from "axios";

import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks-reducer";
import {ResponseType} from "common /common-types";

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export enum ResultCode {
  SUCCESS = 0,
  ERROR = 1,
  ERROR_CAPTHCA = 10,
}
export type LoginType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string
};
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};

export type AddTaskArgType= {
  title: string,
  todolistId: string
}
 export type UpdateTaskArgType = {
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
}

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "b5d3cf05-af76-4fa9-a21c-3372c69b1b8c",
  },
});


// api
export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<
      ResponseType<{ item: TodolistType }>,
      AxiosResponse<ResponseType<{ item: TodolistType }>>,
      { title: string }
    >("todo-lists", { title });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${id}`, { title });
  },

};
