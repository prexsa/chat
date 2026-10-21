require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const app = express();
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const httpServer = require('http').createServer(app);
const { corsConfig } = require('./session');

const auth = require('./routes/auth.routes');
const connectDB = require('./connectDB');

const initSockets = require('./sockets');

const io = new Server(httpServer, {
  cors: corsConfig,
  maxHttpBufferSize: 1e8, // 100 MB
});

// Pass the configured IO instance to your socket orchestrator
initSockets(io);
// middleware needs to be before routes
// parse form data
// app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
// app.use(sessionMiddleware);
app.use('/api/auth', auth);
app.set('trust proxy', 1);
// socket middleware
// io.use(wrap(sessionMiddleware));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 9000;
const DATABASE_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    const conn = await connectDB(DATABASE_URI);
    console.log('MongoDB connected: ', conn.connection.host);
    httpServer.listen(PORT, () =>
      console.log(`Server listening on PORT ${PORT}`),
    );
  } catch (error) {
    console.log('Start Error: ', error);
  }
};

start();
