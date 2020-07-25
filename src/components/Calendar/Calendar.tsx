import React, { useEffect } from 'react'
import './calendar.css';
import {connect, ConnectedProps} from 'react-redux'
import { RootState } from '../../redux/store';
import { selectUserEventsArray, loadUserEvents, UserEvent } from '../../redux/user-events';
import { addZero } from '../../lib/utils';

//To pass arguments to connect function, we first define mapStateToProps and mapDispatchToProps
const mapStateToProps = (state: RootState) => ({
    events: selectUserEventsArray(state) // We have encapsulated the logic of selecting the part of the state required for this component in a selector
  });
  
  const mapDispatchToProps = {
    loadUserEvents
  };

  //Use the 'connector' HOC to connect our component to redux store
const connector = connect(mapStateToProps, mapDispatchToProps);

//Extract the type of the props from the connector using the predefined ConnectedProps
//ConnectedProps - Infers the type of props that a connector will inject into a component.
type PropsFromRedux = ConnectedProps<typeof connector>;

//Extend the Props provided by Redux
interface Props extends PropsFromRedux {}

const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${addZero(month)}-${addZero(day)}`;
};

//Logic to group events by the day
const groupEventsByDay = (events: UserEvent[]) => {
    const groups: Record<string, UserEvent[]> = {};
  
    const addToGroup = (dateKey: string, event: UserEvent) => {
      if (groups[dateKey] === undefined) {
        groups[dateKey] = [];
      }
  
      groups[dateKey].push(event);
    };
  
    events.forEach(event => {
      const dateStartKey = createDateKey(new Date(event.startDate));
      const dateEndKey = createDateKey(new Date(event.endDate));
  
      addToGroup(dateStartKey, event);
  
      if (dateEndKey !== dateStartKey) {
        addToGroup(dateEndKey, event);
      }
    });
  
    return groups;
  };

  const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
    
    useEffect(() => {
        loadUserEvents();
      }, []);
    
      let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
      let sortedGroupKeys: string[] | undefined;
    
      if (events.length) {
        groupedEvents = groupEventsByDay(events);
        sortedGroupKeys = Object.keys(groupedEvents).sort(
          (date1, date2) => +new Date(date1) - +new Date(date2)
        );
      }

      return groupedEvents && sortedGroupKeys ? (
        <div className="calendar-container">
          {sortedGroupKeys.map(dayKey => {
            const events = groupedEvents ? groupedEvents[dayKey] : [];
            const groupDate = new Date(dayKey);
            const day = groupDate.getDate();
            const month = groupDate.toLocaleString(undefined, { month: 'long' });
    
            return (
              <div className="calendar-day">
                <div className="calendar-day-label">
                  <span>
                    {day} {month}
                  </span>
                </div>
                <div className="calendar-events">
                  {events.map(event => {
                    return (
                            <div className="calendar-event">
                            <div className="calendar-event-info">
                                <div className="calendar-event-time">10:00 - 12:00</div>
                                <div className="calendar-event-title">{event.title}</div>
                            </div>
                            <button className="calendar-event-delete-button">&times;</button>
                        </div>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ): (
        <p>Loading...</p>
      )
}

export default connector(Calendar);