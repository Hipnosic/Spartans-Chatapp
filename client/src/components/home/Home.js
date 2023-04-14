import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Navigate } from 'react-router-dom';
import RoomList from './RoomList';
import BroadcastList from './BroadcastList';
import io from 'socket.io-client';
let socket;
const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState([]);
    const [broadcast, setBroadcast] = useState('');
    const [broadcasts, setBroadcasts] = useState([]);

    useEffect(() => {
        socket = io("localhost:5000");
        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [])

    useEffect(() => {
        socket.on('output-rooms', rooms => {
            console.log("outputting rooms")
            setRooms(rooms)
        })
    }, [])

    useEffect(() => {
      socket.on('output-broadcasts', broadcasts => {
          console.log("outputting broadcasts: ", broadcasts)
          setBroadcasts(broadcasts)
      })
  }, [])

    useEffect(() => {
        socket.on('room-created', room => {
            console.log("room created useeffect")
            setRooms([...rooms, room])
        })
    }, [rooms])

    useEffect(() => {
      socket.on('broadcast-created', broadcast => {
          console.log("broadcast created useeffect")
          setBroadcasts([...broadcasts, broadcast])
      })
  }, [broadcasts])
  const logout = async () => {
    try {
        const res = await fetch('http://localhost:5000/logout', {
            credentials: 'include',
        });
        const data = res.json();
        console.log('logout data', data);
        setUser(null)
    } catch (error) {
        console.log(error)
    }

}

    const handleSubmit = e => {
        e.preventDefault();
        socket.emit('create-room', room);
        console.log("Room: ", room);
        setRoom('');
    }

    function handleRoomRemove(roomName, roomId) {
      console.log("Room to remove: ", roomName, "with id: ", roomId);
      socket.emit('remove-room', roomName, roomId);
    }


    const handleBroadcastSubmit = e => {
      e.preventDefault();
      socket.emit('create-broadcast', broadcast);
      setBroadcast('');
    }

    if (!user) {
        return <Navigate to='/login' />
    }
    
    return (
        <div>
            <div className="row">
                <div className="col s12 m6">
                <div className="text-center pt-1 mb-5 pb-1">
                <buttom className="btn btn-outline-danger" onClick={logout}><a href="#">Logout</a></buttom>
                </div>

                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Welcome {user ? user.name : ''}</span>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="form-outline mb-4">
                                        <input
                                            placeholder="Enter a room name"
                                            id="form2Example11" type="text" className="form-control"
                                            value={room}
                                            onChange={e => setRoom(e.target.value)}
                                        />
                                        <label htmlFor="room">Room</label>
                                    </div>
                                </div>
                                <button className="btn btn-outline-danger">Create Room</button>
                            </form>

                              {/* För demo */}
                              {user.admin && <form onSubmit={handleBroadcastSubmit} >
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input
                                            placeholder="Enter broadcast message"
                                            id="broadcast" type="text" className="validate"
                                            value={broadcast}
                                            onChange={e => setBroadcast(e.target.value)}
                                        />
                                        <label htmlFor="broadcast">Broadcast message</label>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3">Send new broadcast</button>
                            </form>}

                        </div>
                    </div>
                </div>
                <div className="col s6 m5 offset-1">
                    {rooms && <RoomList rooms={rooms} handleRemove={handleRoomRemove} />}
                </div>
            </div>
            <div className="row">
                  <div className="col s12">
                        <h2>Broadcasts</h2>
                        {broadcasts && <BroadcastList broadcasts={broadcasts} />}
                  </div>
            </div>
        </div>
    )
}

export default Home
