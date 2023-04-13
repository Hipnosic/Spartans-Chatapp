const express = require('express');
const app = express(); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 
}
const authRoutes = require('./routes/authRoutes');
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 
app.use(authRoutes);


const http = require('http').createServer(app);
const mongoose = require('mongoose');
const socketio = require('socket.io')
const io = socketio(http,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
}); 
const mongoDB = "mongodb://127.0.0.1:27017/chatapp";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected')).catch(err => console.log(err))

const { addUser, getUser, removeUser } = require('./util');
const Message = require('./models/Message');
const Broadcast = require('./models/Broadcast');
const PORT = process.env.PORT || 5000;
const Room = require('./models/Room'); 

io.on('connection', (socket) => {
    console.log("Socket id: ", socket.id);

      const findAllRooms = () => {
            Room.find().then(result => {
                  socket.emit('output-rooms', result)
            })
      }

      const showAllBroadcasts = () => {
            Broadcast.find().then(result => {
                  socket.emit('output-broadcasts', result)
            })
      }

      showAllBroadcasts();
    findAllRooms();
    socket.on('create-room', name => {
        const room = new Room({ name });
        room.save().then(result => {
            io.emit('room-created', result)
        })
    })
    socket.on('create-broadcast', message => {
      const broadcast = new Broadcast({ message });
      broadcast.save().then(result => {
          io.emit('broadcast-created', result)
      })
  })
    socket.on('remove-room', async (roomName, roomId) => {
      console.log("Room name: ", roomName);
      console.log("Room Id: ", roomId);
      try {
            // delete room by name
            await Room.deleteOne({name: roomName});
            // emmit a new socket to client to update the list of rooms
            findAllRooms();
          } catch (err) {
            console.log(err);
      }

    })
    socket.on('join', ({ name, room_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            name,
            room_id,
            user_id
        })
        socket.join(room_id);
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user', user)
        }
    })
    socket.on('sendMessage', (message, room_id) => {
        console.log("Socket id: ", socket.id)
        const user = getUser(socket.id);
        console.log("User: ", user)
        console.log("USER: ", user)
        const msgToStore = {
            name: user.name,
            user_id: user.user_id,
            room_id,
            text: message
        }
        console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(result => {
            io.to(room_id).emit('message', result);
        })

    })
    socket.on('get-messages-history', room_id => {
        Message.find({ room_id }).then(result => {
            socket.emit('output-messages', result)
        })
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    })
});

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});