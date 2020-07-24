import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";

export interface UserEvent{
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

//Instead of maintaining an array of simple UserEvent Objects, we normalise that simple array and store it in the form a 'table'
//This let's us access it more efficiently! Like a freaking local db !!!!!!  🤯 🤯 🤯 🤯 🤯 🤯 
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

//Actions. What actions do is give use the API(vocab) to interact with state. Action creators generally dispatch an object, but
// we've registered thunk, we can dispatch a function which will make the network call to get the data and then dispatch the actual object

//We first define the Actions objects. We use an interface to define an object
const LOAD_REQUEST = 'userEvents/load_request'
const LOAD_SUCCESSFUL = 'userEvents/load_successful'
const LOAD_FAILURE = 'userEvents/load_failure'
interface LoadRequestAction extends Action<typeof LOAD_REQUEST>
{

}

//This is an action with a payload. 
interface LoadSuccessFulAction extends Action<typeof LOAD_SUCCESSFUL>{
    payload: {
        events: UserEvent[]
    }
}

interface LoadFailureAction extends Action<typeof LOAD_FAILURE>{
    error: string
}

/*It's easy to understand the crasziness behind the ThunkAction if you understand the signature

export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: ThunkDispatch<S, E, A>, // signature of the dispatch function showm below
  getState: () => S, //RootState
  extraArgument: E // Extra Argument. Arg passed to think.withExtraArgument()
) => R; //Return type

export interface ThunkDispatch<S, E, A extends Action> {
  <T extends A>(action: T): T;
  <R>(asyncAction: ThunkAction<R, S, E, A>): R;
}
*/

export const loadUserEvents = ():ThunkAction<
void,
RootState,
undefined,
LoadRequestAction | LoadSuccessFulAction | LoadFailureAction // Need to mention all acceptable actions here else the compiler yells!!
> => async (dispatch, getState) => {
    //We dispatch this action to indicate that the state id loading a request
    dispatch({
        type: LOAD_REQUEST
    })
    
    try // Since this is a network request, we use a try catch block
    { //Make the network API call to fetch the userEvents from db.json
        const response = await fetch('http://localhost:3001/events')
        console.log(response);
        
        //The response type given by the api is of the type any. So technically this line can break in production
        //Unlike WCF, we don't have the client and server agreeing on an explicit contract, so we trust our API server to return data is proper shape
        const events:UserEvent[] = await response.json()

        dispatch({
            type: LOAD_SUCCESSFUL,
            payload: {events}
            }
        )
    }
    catch(e){
        dispatch({
            type: LOAD_FAILURE,
            error: 'Failed to load events.'
          });
    }
}

//These are the 2 selectors which return the specific parts of the state. These are called fron the mapStateToProps which passes in the Root state
const selectUserEventsState = (rootState: RootState) => rootState.events;

export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map(id => state.byIds[id]);
};

const eventsReducer = (state: UserEventsState = initialState, action: LoadSuccessFulAction) => {
    switch(action.type){
        case LOAD_SUCCESSFUL: 
            const {events} = action.payload
            //This is where we transform/normalise our simple array of events into a db table
            //getting an array if id's is easy peasy using map
            //constructing the 'table' outta this array is done by using the reduce function. We pass 2 arguments, a reducer function and an initial object
            //reducer is a function that accepts 2 parameters . First is the object that we want to reduce to, second is each element in the collection
            //In this function we just construct this dictionary object , finally we return the new state
            return {
                ...state,
                allIds: events.map( e => e.id ),
                byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
                    byIds[event.id] = event;
                    return byIds;
                },{})
            }
        default: return state;
    }
}

export default eventsReducer