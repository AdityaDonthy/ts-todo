//Ducks is a modular pattern that collocates actions, action types and reducers in a file.

/* According to the Ducks proposal, A module…
1. MUST export default a function called reducer()
2. MUST export its action creators as functions
3. MUST have action types in the form npm-module-or-app/reducer/ACTION_TYPE
4. MAY export its action types as UPPER_SNAKE_CASE, if an external reducer needs to listen for them, or if it is a published reusable library
*/

// Below is one Redux Duck for the Recorder Component


//This is the new reducer that is going to define a different part of state in the store's state tree. That's the reason it's isolated from 
//user-events reducer. Both are independent so you keep them separate. 
// 1. We define the reducer for this 
// 2. we define the actions that this piece of state can interact with, define the api for this part of the state treee
// 3. Which means we create Action Creators

import { Action } from "redux";
import { RootState } from "./store";

//This is the piece of state the Recorder component would be connected to. Since it's isolated from others, the components connected to this
// piece of the state are notified of changes so they can re-render affecting only those components

interface RecorderState {
    dateStart: string
}

//Let's first define names of our Action 'types' as constant name/type

//Below 2 declarations are so trippy and confusing! They different in a subtle. TS infers a type of the value if it can, 
//like here it's pretty obvious to be a string!!!
// Ignore this -> Instead of defining a const string like we do in js, we create a const type with a name which is a string type
//For instance the below 2 are different when used to define the Actions
//First would be considered as Action<"START_RECORDER">
//Second would be considered an Action<string> 
//So subtle but such a huge difference !!! 🤯 🤯 🤯 🤯 🤯 🤯 
const START_RECORDER = 'Start-Recorder'
const STOP_RECORDER: string = 'Stop-Recorder'

console.log(typeof START_RECORDER) // This logs as string. Then what's the difference between START_RECORDER and STOP_RECORDER
console.log(typeof STOP_RECORDER) // string

// We now define a type that describes the action
/**
 * An *action* is a plain object that represents an intention to change the
 * state. Also, sort of give vocabulary to interact with our state. Actions are the only way to get data into the store. Any data,
 * whether from UI events, network callbacks, or other sources such as WebSockets needs to eventually be dispatched as actions.
 *
 * Actions must have a `type` field that indicates the type of action being performed. Types can be defined as constants and imported from another
 * module. It's better to use strings for `type` than Symbols because strings are serializable.
 * 
 Example:
  export interface Action<T = any> {
    type: T
    }
 */

 // Below 2 are not so different .. Both are Action of type string
type StartAction = Action<typeof START_RECORDER> // This is an action of type 'Start-Recorder'
type StopAction = Action<typeof STOP_RECORDER>// This is an action of type any string

//An action creator which creates an action object and returns it. Usually an action creator accepts a payload and uses it in construction
export const StartRecorder = (): StartAction => {
    return {
        type: 'Start-Recorder' 
    }
}

//No payload yet
export const StopRecorder = (): StopAction => {
    return {
        type: STOP_RECORDER
    };
}

const initialState: RecorderState = {
    dateStart: ''
}

//Selectors 
//useSelector hook Signature: const result: any = useSelector(selector: Function, equalityFn?: Function)
//useSelector takes a function as an argument and the signature of function is selector: (state: TState) => TSelected . 
//It takes in the state(passed by useSelector) and returns the specific piece of state.  So it's very similar to the mapStateToProps function. 
//The return value of this selector will be used as the return value of the useSelector() hook in a component.
//You may call useSelector() multiple times within a single function component. Each call to useSelector() creates an individual subscription to the Redux store. 
//Because of the React update batching behavior used in React Redux v7, a dispatched action that causes multiple useSelector()s in the same 
//component to return new values should only result in a single re-render.
//This is used wthin the component to 

export const selectStartDate = (rootState: RootState) => {
    return rootState.recorder.dateStart
    //return selectRecorder().dateStart
}

//Another selector to select the whole recorder piece/object of the state tree
export const selectRecorder = (rootState: RootState) => {
    return rootState.recorder
}

//Instead of defining our action as Action<string>, we make it even more specific and use the types we had defined for Actions
// node -e "console.log(new Date().toISOString())"
// 2020-07-22T15:16:42.260Z
//It returns a new object with a property type with a value 'START_RECORDER' and startDate with current time as the value as a string
const recorderReducer = (state:RecorderState = initialState, action: StartAction|StopAction) => {
    switch(action.type){
        
        case START_RECORDER:
            const newState = {...state, dateStart: new Date().toISOString()} 
            console.log(newState)
            return newState
        case STOP_RECORDER: 
            return {...state, startDate: ''} 
        default :
            return state;
    }
}

export default recorderReducer;