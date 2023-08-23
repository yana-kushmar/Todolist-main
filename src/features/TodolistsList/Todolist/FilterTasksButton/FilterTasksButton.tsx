import Button from "@mui/material/Button";
import React from "react";
import {FilterValuesType} from "features/TodolistsList/todolists-reducer";


type FilterTasksButtonsPropsType ={
    onAllClickHandler: () => void
    onActiveClickHandler: () => void
    onCompletedClickHandler: () => void
    filter: FilterValuesType;
}


export const FilterTasksButtons = (props: FilterTasksButtonsPropsType) => {

    return (
        <div>
            <Button variant={props.filter === "all" ? "outlined" : "text"} onClick={props.onAllClickHandler} color={"inherit"}>
                All
            </Button>
            <Button
                variant={props.filter === "active" ? "outlined" : "text"}
                onClick={props.onActiveClickHandler}
                color={"primary"}
            >
                Active
            </Button>
            <Button
                variant={props.filter === "completed" ? "outlined" : "text"}
                onClick={props.onCompletedClickHandler}
                color={"secondary"}
            >
                Completed
            </Button>
        </div>
    )
}
