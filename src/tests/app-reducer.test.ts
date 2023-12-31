import {appActions, appReducer, RequestStatusType} from "app/appReducer/app-reducer";

// let startState: InitialStateType;

describe('app slice', () => {
  let startState = {
    error: null,
    status: 'idle' as RequestStatusType,
    isInitialized: false
  }


  it("correct error message should be set ", () => {
    const endState = appReducer(startState, appActions.setAppError({error:"some error"}));

    expect(endState.error).toBe("some error");
  })


})



