import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Navigate } from 'react-router-dom';
import ChannelList from './ChannelList';
import BroadcastList from './BroadcastList';
import io from 'socket.io-client';
let socket;
const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const [channel, setChannel] = useState('');
    const [channels, setChannels] = useState([]);
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
        socket.on('output-channels', channels => {
            console.log("outputting channels")
            setChannels(channels)
        })
    }, [])

    useEffect(() => {
      socket.on('output-broadcasts', broadcasts => {
          console.log("outputting broadcasts: ", broadcasts)
          setBroadcasts(broadcasts)
      })
  }, [])

    useEffect(() => {
        socket.on('channel-created', channel => {
            console.log("channel created useeffect")
            setChannels([...channels, channel])
        })
    }, [channels])

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
        socket.emit('create-channel', channel);
        console.log("channel: ", channel);
        setChannel('');
    }

    function handlechannelRemove(channelName, channelId) {
      console.log("channel to remove: ", channelName, "with id: ", channelId);
      socket.emit('remove-channel', channelName, channelId);
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
            <nav class="navbar navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                    <img className="logoImage" src={require('../../assets/spartan.png')} alt="logo"/>Spartans Chatlobby</a>
                    <div className="text-center pt-1 mb-5 pb-1">
                <buttom className="btn btn-outline-danger" onClick={logout}><a href="#">Logout</a></buttom>
                </div>
                </div>
                </nav>
                <div className="col s12 m6">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Welcome {user ? user.name : ''}</span>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="form-outline mb-4">
                                        <input
                                            placeholder="Enter a channel name"
                                            id="form2Example11" type="text" className="form-control"
                                            value={channel}
                                            onChange={e => setChannel(e.target.value)}
                                        />
                                        <label htmlFor="channel">channel</label>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3">Create channel</button>
                            </form>

                              {/* För demo */}
                              {user.admin && <form onSubmit={handleBroadcastSubmit} >
                                <div className="row mt-5">
                                    <div className="form-outline mb-4">
                                        <input
                                            placeholder="Enter broadcast message"
                                            id="broadcast" type="text" className="validate form-control" 
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
                    {channels && <ChannelList channels={channels} handleRemove={handlechannelRemove} />}
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
