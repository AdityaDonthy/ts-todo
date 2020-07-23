import React, { useRef, useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './Recorder.css'
import { StartRecorder, selectStartDate, StopRecorder } from '../../redux/recorder';
import cx from 'classnames';



//We use redux hooks. useDispatch() hook returns the store's dispatch function so we can use that to dispatch actions 
//The selector is approximately equivalent to the mapStateToProps argument to connect conceptually. 
//The selector will be called with the entire Redux store state as its only argument. 
//The selector will be run whenever the function component renders (unless its reference hasn't changed since a previous render of the component). 
//useSelector() will also subscribe to the Redux store, and run your selector whenever an action is dispatched.

const Recorder: React.FC = () => {
    const dispatch = useDispatch()
    //This here is so huge. I'm accessing a selector function written in my redux duck and passig it to the redux's useSelector
    // Redux's useSelector will inturn call the passed in selector with the global state and the selector selects the specific state object from the state tree
    // It's used to read/select the specific part of the state tree
    // useSelector() will also subscribe to the Redux store, and run your selector whenever an action is dispatched. 
    // So I dispatch an action , state changes, useSelector is subscribed to the store, so it's run again
    const startDate = useSelector(selectStartDate)
    const started = startDate !== ''

    //We use the useRef hook to preserve the value between renders of the function. Couldn't we use the useState ??
    //useRef() is useful for more than the ref attribute. It’s handy for keeping any mutable value around similar to how you’d use instance fields in classes.
    // To cause a re-render, we use the useState
    let interval = useRef<number>(0);
    const [, setCount] = useState<number>(0);
    const handleRecord = () => {
        // If the counter is already started, consider this as a stop action and dispatch it
        if(started){
            window.clearInterval(interval.current);
            dispatch(StopRecorder());
        }// else,  we dispatch the stat action and increment the count by 1
        else{
            dispatch(StartRecorder());
            interval.current = window.setInterval(() => {
                setCount(count => count + 1);
            }, 1000);
    
        }
    }

    //clean up when the function unmounts
    useEffect(() => {
        return () => {
          window.clearInterval(interval.current);
        };
      }, []);


    //add a 0 if the number is less than 10
    const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

    //logic to calculate the elapsed hours, minutes, seconds for the counter. 
    //So because of the setInterval, every second the below logic is executed and the ui is re-rendered
    //
    let seconds = started ? Math.floor((Date.now() - new Date(startDate).getTime()) / 1000) : 0;
    const hours = seconds ? Math.floor(seconds / 60 / 60) : 0;
    seconds -= hours * 60 * 60;
    const minutes = seconds ? Math.floor(seconds / 60) : 0;
    seconds -= minutes * 60;

    return (
        // <div className="recorder"> Use the classnames package to conditionally add the recorder-started style
        <div className={cx('recorder', {'recorder-started': started})}>
            <button className="recorder-record" onClick={handleRecord}>
                <span></span>
            </button>
            <div className="recorder-counter">
                {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
            </div>
        </div>
    )
}

export default Recorder;