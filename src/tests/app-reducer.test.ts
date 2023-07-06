import {appReducer, InitialStateType, setAppErrorAC, setAppLoadingStatus} from "../app/appReducer/AppReducer";

let startState: InitialStateType

beforeEach(() => {
    startState = {
        error: null,
        status: 'idle'
    }
})

test('correct error message should be set ', () => {
    const endState= appReducer(startState, setAppErrorAC('some error'))

    expect(endState.error).toBe('some error')

})

test('correct status  should be set ', () => {
    const endState= appReducer(startState, setAppLoadingStatus('loading'))

    expect(endState.status).toBe('loading')

})