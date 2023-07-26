import {appActions, appReducer, RequestStatusType} from "../app/appReducer/AppReducer";

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

  it("correct status  should be set ", () => {
    const endState = appReducer(startState, appActions.setAppLoadingStatus({status: "loading"}));

    expect(endState.status).toBe("loading");
  });


})



