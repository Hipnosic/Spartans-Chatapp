import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Navigate } from 'react-router-dom';
import RoomList from './RoomList';
import io from 'socket.io-client';
let socket;
const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState([]);
    const [deleteRoom, setDeleteRoom] = useState('');
    // sets up a socket connection to a server running on "localhost:5000" when the component mounts, and disconnects the socket and removes event listeners when the component is unmounted or when the effect is re-triggered.
    useEffect(() => {
        socket = io("localhost:5000");
        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [])
    // When the 'output-rooms' event is emitted from the server, the setRooms function is called to update the state of the component with the new rooms data, triggering a re-render of the component with the updated information.
    useEffect(() => {
        socket.on('output-rooms', rooms => {
            setRooms(rooms)
        })
    }, [])
    // This ensures that the event listener is kept up-to-date with the latest value of rooms and can react to changes in its value accordingly.
    useEffect(() => {
        socket.on('room-created', room => {
            setRooms([...rooms, room])
        })
    }, [rooms])
    // By including rooms in the dependency array of the useEffect hook, the effect will be re-triggered whenever the value of rooms changes. This allows the code inside the effect to respond to changes in the rooms state and perform any necessary actions, such as logging the updated value to the console or triggering other side effects.
    useEffect(() => {
        console.log("Nytt rum skapades: ", rooms)
    }, [rooms])

    useEffect(() => {
        
    }) 
    // Overall, this code snippet represents a typical form submission event handler in a React component that uses socket.io to emit an event to a server and perform related actions, such as logging data to the console and updating component state.
    const handleSubmit = e => {
        e.preventDefault();
        socket.emit('create-room', room);
        console.log("Room: ", room);
        setRoom('');
    }
  
    if (!user) {
        return <Navigate to='/login' />
    }
    
    return (
        <div>
            <div className="row">
                <div className="col s12 m6">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Welcome {user ? user.name : ''}</span>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input
                                            placeholder="Enter a room name"
                                            id="room" type="text" className="validate"
                                            value={room}
                                            onChange={e => setRoom(e.target.value)}
                                        />
                                        <label htmlFor="room">Room</label>
                                    </div>
                                </div>
                                <button className="btn">Create Room</button>
                            </form>
                        </div>
                       
                    </div>
                </div>
                <div className="col s6 m5 offset-1">
                    {rooms && <RoomList rooms={rooms} />}
                </div>
            </div>
        </div>
    )
}

export default Home
