import React, {useState} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {LinearProgress} from "@mui/material";
import {useAppSelector} from "./store";
import {RequestStatusType} from "./appReducer/AppReducer";
import {ErrorSnackbars} from "../components/ErrorsSnackbar/ErrorsSnackbar";
import {Login} from "../features/Login/Login";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";


function App() {
    const status = useAppSelector<RequestStatusType>(store => store.app.status)
    return (
        <div className="App">
            <ErrorSnackbars/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === "loading" && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        404: PAGE NOT FOUND</h1>}/>
                    <Route path={'*'} element={<Navigate to={'404'}/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App
