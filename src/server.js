import "dotenv/config"
import express from "express";
import connectionDB from "./connection.js";
import dns from "dns";

dns.setServers(["8.8.8.8","8.8.4.4"])

const app = express();

await connectionDB();

app.listen(process.env.PORT || 7000,()=>{
  console.log("server listening");
})
