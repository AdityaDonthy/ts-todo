import {combineReducers, createStore, applyMiddleware} from 'redux'; 
import eventsReducer from './user-events';
import recorderReducer from './recorder';
import { logger } from './middleware/logger';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    events: eventsReducer,
    recorder: recorderReducer
});

//get the type of the rootReducer
export type RootState = ReturnType< typeof rootReducer>

const store = createStore(rootReducer, applyMiddleware(logger, thunk))
//What the dispatch function of the redux store an understand is an object. However, when we register thunk as a middleware, what it allows 
//us do is we can now instead dispatch a function. In this function, we make an async call, wait for the response and then dispatch the action

// thunk.withExtraArgument() is an interesting function. 
export default store;