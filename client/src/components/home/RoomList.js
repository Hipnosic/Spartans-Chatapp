import React from 'react';
import Room from './Room';
import { Link } from 'react-router-dom';
// Inside the component, a list of rooms is rendered using the map function on the rooms array. For each room object in the rooms array, a Link component from a routing library (such as React Router) is rendered with the to prop set to the URL path for the chat room. The key prop is set to the _id property of the room object, which is used by React to uniquely identify each rendered item in a list. The Room component is presumably another custom component that displays information about a specific chat room, such as the room name, participants, or messages.
const RoomList = ({ rooms }) => {
    return (
        <div>
            {rooms && rooms.map(room => (
                <Link to={'/chat/' + room._id + '/' + room.name} key={room._id} >
                    <Room name={room.name} />
                </Link>
            ))}
        </div>
    )
}

export default RoomList
