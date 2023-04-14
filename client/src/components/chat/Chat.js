import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { useParams, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Messages from './messages/Messages';
import Input from './input/Input';
import './Chat.css';
let socket;
const Chat = () => {
    const ENDPT = 'localhost:5000';

    const { user, setUser } = useContext(UserContext);
    let { channel_id, channel_name } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        socket = io(ENDPT);
        socket.emit('join', { name: user.name, channel_id, user_id: user._id })
    }, [])

    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message])
        })
    }, [messages])

    useEffect(() => {
        socket.emit('get-messages-history', channel_id)
        socket.on('output-messages', messages => {
            setMessages(messages)
        })
    }, [])
    const sendMessage = event => {
        event.preventDefault();
        if (message) {
            console.log(message)
            socket.emit('sendMessage', message, channel_id, user._id, user.name);
            setMessage('');
        }
    }
    if(!user){
        return <Navigate to='/login' />
    }
    return (
        <div className="outerContainer">
            <div className="container">
                <Messages messages={messages} user_id={user._id} />
                <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    )
}

export default Chat
