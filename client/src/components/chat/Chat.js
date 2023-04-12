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
    let { room_id, room_name } = useParams();
    const [message, setMessage] = useState('');
    // The initial value of messages is an empty array, which is likely used to store the messages received in the chat room.
    const [messages, setMessages] = useState([]);
    // Used to establish a socket.io connection to the server and emit a 'join' event with user and room information to join the chat room when the component mounts.
    useEffect(() => {
        socket = io(ENDPT);
        // Socket.emit sends an event with a 'join' event with user and room information to join the chat room when the component mounts. 
        socket.emit('join', { name: user.name, room_id, user_id: user._id })
    }, [])
    // This useEffect hook is likely used to update the messages state when a new message is received from the server through the socket.io 'message' event. It uses the setMessages function to append the new message to the current messages array.
    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message])
        })
    }, [messages])
    // Fetch the message history of the chat room from the server when the component mounts. It emits a 'get-messages-history' event with the room_id to the server, and then updates the messages state with the received messages array through the 'output-messages' event.
    useEffect(() => {
        socket.emit('get-messages-history', room_id)
        socket.on('output-messages', messages => {
            setMessages(messages)
        })
    }, [])
    // This function is called when the form in the Input component is submitted. It prevents the default form submission behavior, and emits a 'sendMessage' event with the message, room_id, user._id, and user.name to the server using the socket.io connection. It also clears the message state by calling setMessage('') after the message is sent.
    const sendMessage = event => {
        event.preventDefault();
        if (message) {
            console.log(message)
            socket.emit('sendMessage', message, room_id, user._id, user.name);
            setMessage('');
        }
    }
    if(!user){
        return <Navigate to='/login' />
    }
    // This is the JSX returned by the Chat component, which renders a chat interface with a container div, a Messages component that displays the messages, and an Input component that allows users to input and send messages. The message state, setMessage function, and sendMessage function are passed as props to the Input component to handle the input and sending of messages.
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
