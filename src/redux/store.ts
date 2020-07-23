import {combineReducers, createStore, applyMiddleware} from 'redux'; 
import eventsReducer from './user-events';
import recorderReducer from './recorder';
import { logger } from './middleware/logger';

const rootReducer = combineReducers({
    events: eventsReducer,
    recorder: recorderReducer
});

//get the type of the rootReducer
export type RootState = ReturnType< typeof rootReducer>

const store = createStore(rootReducer, applyMiddleware(logger))

export default store;