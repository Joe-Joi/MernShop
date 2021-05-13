import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import schedule from 'node-schedule';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import handleExpiredOrders from './middleware/expireMiddleware.js';
import connectDB from './config/db.js';
import {createChat, updateChat} from './controllers/userChatController.js'
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { createServer } from "http";
import { Server } from "socket.io";
import userChatRoutes from './routes/userChatRoutes.js'
dotenv.config();
console.log(process.env.MONGO_URI);
connectDB();

function scanExpiredOreders() {
  // scan every 30 seconds
  schedule.scheduleJob('1/30 * * * * *', function () {
    // console.log('scheduleCronstyle:' + new Date());
    handleExpiredOrders();
  });
}

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chatlist', userChatRoutes)
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  }
});

const PORT = process.env.PORT || 5000

let socketPool =[]
io.on("connection", (socket)=>{
  console.log(socket.handshake.headers["my-custom-header"]+" connected")
  socketPool.push({
    socketId:socket.id,
    socketUserId:socket.handshake.headers["my-custom-header"],
  })
  socket.on("private-message",(chatId, message)=>{
    //socket.emit("private-message",chatId,message)
    console.log(socketPool.length)
    for(var sock of socketPool){
      console.log(sock.socketId+"   "+sock.socketUserId)
      console.log(JSON.stringify(sock))
      if(sock.socketUserId==message.destUser._id){
        console.log("要在chatId:"+chatId+"中发"+JSON.stringify(message.msgContent))
        //socket.emit("private-message",chatId,message)
        updateChat(chatId,message)
        // if(result=='failed'){
        //   console.log("failed to save chat"+chatId)
        //   break
        // }
        socket.to(sock.socketId).emit("private-message",chatId,message)
        break
      }
    }
  })

  socket.on("createNewChat",(newchat)=>{
    console.log("创建新的聊天")
    console.log(JSON.stringify(newchat))
    createChat(newchat)
  })
})


httpServer.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

scanExpiredOreders();
