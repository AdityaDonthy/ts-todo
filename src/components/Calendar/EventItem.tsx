import React, { useState, useEffect, useRef } from 'react';
import {
  UserEvent,
  deleteUserEvent
} from '../../redux/user-events';
import { useDispatch } from 'react-redux';

interface Props {
  event: UserEvent;
}

const EventItem: React.FC<Props> = ({ event }) => {
  const dispatch = useDispatch();
  //We need to maintain a local state to check if ween to show a textvox instead of a div
  const [editable, setEditable] = useState(false)

  const handleDeleteClick = () => {
    dispatch(deleteUserEvent(event.id));
  };

  const handleTitleClick = () => {
      setEditable(!editable); 
  }
 
  return (
    <div className="calendar-event">
      <div className="calendar-event-info">
        <div className="calendar-event-time">10:00 - 12:00</div>
        <div className="calendar-event-title">
            {editable ? (<input type="text" value={event.title}/>)
                      :(<span onClick={handleTitleClick}>{event.title}</span>)
            }
        </div>
      </div>
      <button
        className="calendar-event-delete-button"
        onClick={handleDeleteClick}
      >
        &times;
      </button>
    </div>
  );
};

export default EventItem;
