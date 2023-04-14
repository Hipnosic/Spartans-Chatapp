const express = require('express');
const app = express(); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 
}
const routes = require('./routes/routes');
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 
app.use(routes);


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
const Channel = require('./models/Channel'); 

io.on('connection', (socket) => {
    console.log("Socket id: ", socket.id);

    const findAllChannels = () => {
        Channel.find().then(result => {
                socket.emit('output-channels', result)
        })
    }

    const showAllBroadcasts = () => {
        Broadcast.find().then(result => {
                socket.emit('output-broadcasts', result)
        })
    }

    showAllBroadcasts();
    findAllChannels();
    socket.on('create-channel', name => {
        const channel = new Channel({ name });
        channel.save().then(result => {
            io.emit('channel-created', result)
        })
    })
    socket.on('create-broadcast', message => {
      const broadcast = new Broadcast({ message });
      broadcast.save().then(result => {
          io.emit('broadcast-created', result)
      })
  })
    socket.on('remove-channel', async (channelName, channelId) => {
      console.log("Channel name: ", channelName);
      console.log("Channel Id: ", channelId);
      try {
            // delete channel by name
            await Channel.deleteOne({name: channelName});
            // emmit a new socket to client to update the list of channel
            findAllChannels();
          } catch (err) {
            console.log(err);
      }

    })
    socket.on('join', ({ name, channel_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            name,
            channel_id,
            user_id
        })
        socket.join(channel_id);
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user', user)
        }
    })
    socket.on('sendMessage', (message, channel_id) => {
        console.log("Socket id: ", socket.id)
        const user = getUser(socket.id);
        console.log("User: ", user)
        console.log("USER: ", user)
        const msgToStore = {
            name: user.name,
            user_id: user.user_id,
            channel_id,
            text: message
        }
        console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(result => {
            io.to(channel_id).emit('message', result);
        })

    })
    socket.on('get-messages-history', channel_id => {
        Message.find({ channel_id }).then(result => {
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