import "dotenv/config"
import express from "express";
import connectionDB from "./connection.js";
import dns from "dns";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/routes.js";

dns.setServers(["8.8.8.8","8.8.4.4"])

const app = express();
await connectionDB();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",userRouter)

app.listen(process.env.PORT || 7000,()=>{
  console.log("server listening");
})
