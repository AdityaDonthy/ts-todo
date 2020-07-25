This project was bootstrapped with [Create React App]

## Available Scripts

In the project directory, you can run:

### `npm start`

It can be used to record events and log the time taken to complete a event.Purpose of building this App was to playaround with Typescript.
This is a simple App built using Typescript with Redux. 
Redux uses the Redux Duck pattern
We also run a fake server using json-server library

## Functionality
User is given an option to start the timer at the beginning of the event and then stop when it ends. Kinda like a stopwatch. Please read the extensive comments in the code to understand more


We need to define how we can interact with our redux store. The pattern to create a flow is as follows
1. Define the constant that describes the Action 
    const LOAD_REQUEST = 'userEvents/load_request'
2. Extend the Redux Action and create a custom Action. We define our Action Object
```
    interface LoadSuccessFulAction extends Action<typeof LOAD_SUCCESSFUL>{
    payload: {
        events: UserEvent[]
        }
    }
```
3. We next need to create an Action Creator. A ThunkAction which does the async network call
```
    export const loadUserEvents = ():ThunkAction<
        void,
        RootState,
        undefined,
        LoadRequestAction | LoadSuccessFulAction | LoadFailureAction // Need to mention all acceptable actions here else the compiler yells!!
        > => async (dispatch, getState) => {
    }
```  
4. We make the network call in the thunk action await for response and then dispatch an actual Action after reading the response
```
    const response = await fetch('http://localhost:3001/events')
    const events:UserEvent[] = await response.json()

    dispatch({
        type: LOAD_SUCCESSFUL,
        payload: {events}
        }
    )
```  
5. This Action Creator is wat will be called from the Component
6. Now we need to handle the Action in the Reducer
```
    switch(action.type){
        case LOAD_SUCCESSFUL: 
            const {events} = action.payload
            return {
                ...state,
                allIds: events.map( e => e.id ),
            }
    }
```
7.New state is notified to the component so they can rr-render