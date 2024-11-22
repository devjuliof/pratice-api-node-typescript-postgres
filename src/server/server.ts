import { Client } from "pg";
import dotenv from "dotenv";

import express from "express";

import { router } from "./routes";

dotenv.config();

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "myapp_db",
  password: process.env.DB_PASSWORD,
  port: 3000,
});

client
  .connect()
  .then(() => {
    console.log("Conectado ao banco");
  })
  .catch((err) => {
    console.log("deu errado");
    console.log(err.message);
    console.log(err.stack);
  });

const server = express();

server.use(express.json());

server.use(router);

export { server, client };
