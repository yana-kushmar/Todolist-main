import React, {useEffect, useState} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {CircularProgress, LinearProgress} from "@mui/material";
import {useAppDispatch, useAppSelector} from "./store";
import {RequestStatusType, setIsInitializedAC} from "./appReducer/AppReducer";
import {ErrorSnackbars} from "../components/ErrorsSnackbar/ErrorsSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {logOutTC, meTC} from "../features/Login/auth-reducer";


function App() {
    const dispatch = useAppDispatch()
    const status = useAppSelector<RequestStatusType>(store => store.app.status)
    const isInitialized = useAppSelector<boolean>(store => store.app.isInitialized)
    const isLoggedIn= useAppSelector(store => store.auth.isLoggedIn)

    useEffect(() => {
        dispatch(meTC())
    }, [])

    if (!isInitialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const logOut = () => {
        dispatch(logOutTC())
    }
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
                    {isLoggedIn && <Button color="inherit" onClick={logOut}>Log out</Button>}
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
