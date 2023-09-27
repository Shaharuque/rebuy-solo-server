import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
// For Socket IO
import { createServer } from "http";
import { Server, Socket } from "socket.io";
// import routes
import authRoute from "./route/authRoute";
import userRoute from "./route/userRoute";
import adRoute from "./route/adRoute";
import bidRoute from "./route/bidRoute";
import orderRoute from "./route/orderRoute";
import openAIRoute from "./route/openAIRoute";
import payRoute from './route/payRoute'

const roooms = ["general", "random", "news", "games", "coding"];
const port = process.env.PORT || 9000;

// Socket IO server connected on 8080 port
const httpServer = createServer();
const socketIO = new Server(httpServer, {
  pingTimeout: 60000, //if no one is active to chat then socket will be off
  cors: {
    origin: "*",
  },
});


//---------------------New Chat app video:creating chat app using chakra ui and socket io------------
socketIO.on("connection", (socket: Socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("joinRoom", ({ userId, room }: any) => {
    socket.join(`${userId} ${room}`);
    console.log(`${userId} joined room for product id: ${room}`);
  });

  //From client side a bidding amount will be emitted to server
  socket.on("bid", ({ userId, room, bidAmount }: any) => {
    console.log(
      `bid amount: ${bidAmount} from user id: ${userId} for product id: ${room}`
    );

    // socketIO.to(`${userId} ${room}`).emit('bid', bidAmount); //only the user who bid will see the bid amount

    // bitAmount will be emitted to all client side
    socketIO.emit("bid", { bidAmount, room });
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

//socket io server listen on 8080 port
httpServer.listen(8081, () => {
  console.log(`Server listening on port 8081`);
});

//----------------------------------------//

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yz2oh.mongodb.net/rebuy?retryWrites=true&w=majority`
    );
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true, // Allow credentials (cookies)
  })
  // cors({origin:true, credentials:true})
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  res.send('Hello World!')
})
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", adRoute);
app.use("/api/bid", bidRoute);
app.use("/openai", openAIRoute);
app.use("/api/cart", orderRoute);
app.use("/api/payment", payRoute);

//error middleware
app.use((err: any, req: any, res: any, next: any) => {
  const errorStatus = err.status || 500;
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: "Something Went Wrong",
    stack: err.stack,
  });
});

app.listen(port, () => {
  connect();
  console.log("Connected to backend.");
});
