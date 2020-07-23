import { AnyAction } from "redux";

interface UserEvent{
    id: number;
    title: string;
    startDate: string;
    endDate: string;
}

//https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape 
// Usually we would store an array of events in the state, but we are normalising the data here
// The basic concepts of normalizing data are:
// 1. Each type of data gets its own "table" in the state.
// 2. Each "data table" should store the individual items in an object, with the IDs of the items as keys and the items themselves as the values.
// 3. Any references to individual items should be done by storing the item's ID.
// 4. Arrays of IDs should be used to indicate ordering.

interface UserEventsState {
    //maintain  a dictionary of the id from the UserEvent object and the actual UserEvent Object
    // Another way of wriring this is Record<number, UserEvent>; The advantage is if the type of id changed , TS will infer this !
    byIds: Record<UserEvent['id'],UserEvent>;
    allIds: number[]
    //allIds: UserEvent['id'][]
}

const initialState: UserEventsState = {
    byIds: {},
    allIds: []
}


const eventsReducer = (state: UserEventsState = initialState, action: AnyAction) => {
    switch(action.type){
        default: return state;
    }
}

export default eventsReducer