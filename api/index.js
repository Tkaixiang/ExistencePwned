const express = require('express')
const dotenv = require("dotenv")
const cors = require('cors')
const errorHandling = require('./middlewares/errorHandling.js')
const input = require('input')

//gramjs stuff
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require('telegram/events');

//socket.io and express stuff
const app = express()
const PORT = 9000

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

dotenv.config();

var connections = {
  "stringSession": { socketID: 0, clientObject: null }
}

const apiId = 7251351;
const apiHash = "766e8ba337aef7f310ec69871b519758";

//Starting Middlewares
app.use(express.json())
app.use(cors())

//routes
app.post('/login', async (req, res) => {

  const stringSession = new StringSession(""); // fill this later with the value from session.save()

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("number ?"),
    password: async () => await input.text("password?"),
    phoneCode: async () => console.error("2FA not supported atm"),
    onError: (err) => console.log(err),
  });
  const dialogs = await client.getDialogs({})
  const filteredDialogs = dialogs.map((item) => {
    return newItem = { name: item.name, unread: item.unreadCount, group: item.isGroup }
  })
  const sessionKey = client.session.save()
  await client.disconnect()
  res.send({ success: true, data: filteredDialogs, sessionKey: sessionKey })
})

const startup = async (msg, socketID) => {
  const stringSession = new StringSession(""); // fill this later with the value from session.save()

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("number ?"),
    password: async () => await input.text("password?"),
    phoneCode: async () => console.error("2FA not supported atm"),
    onError: (err) => console.log(err),
  });
  const dialogs = await client.getDialogs({})
  const filteredDialogs = dialogs.map((item) => {
    return newItem = { name: item.name, unread: item.unreadCount, group: item.isGroup }
  })
  const sessionKey = client.session.save()
  await client.getMe
  console.log('all done')
}
startup()


io.on('connection', (socket) => {
  socket.on('startup', (msg) => {
    startup(msg, socket.id)
  })

  socket.on('disconnect', async () => {
    if (socket.id in connections) {
      await connections[socket.id].clientObject.disconnect()
      delete connections[socket.id]
    }

  })
})

//Ending Middlewares
app.use(errorHandling.unknownEndpoint)
app.use(errorHandling.errorHandler)

//Start server
server.listen(PORT, () => {
  console.info("Server started at port " + PORT)
});

