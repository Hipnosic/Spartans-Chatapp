import React from 'react';
import Room from './Room';
const RoomList = ({ rooms, handleRemove }) => {
    return (
        <div>
            {rooms && rooms.map(room => (
                  <Room key={room._id} name={room.name} handleRemove={handleRemove} roomId={room._id} roomName={room.name} />
            ))}
        </div>
    )
}

export default RoomList
