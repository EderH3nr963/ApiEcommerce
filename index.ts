import express from "express";
import session from "express-session";
import dotenv from "dotenv";

import connectRedis from "connect-redis";
import Redis from "ioredis";

import AuthRoutes from "./routes/AuthRoutes";
import UsuarioRoutes from "./routes/UsuarioRoutes";
import EnderecoRoutes from "./routes/EnderecoRoutes";
import ProdutoRoutes from "./routes/ProdutoRoutes";

import ValidateAuth from "./middlewares/ValidateAuth";
import "./types/expressSessionType";

const redisClient = new Redis();
const RedisStore = connectRedis(session);
const app = express();
const cors = require("cors")

dotenv.config();
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:5173", // ou "*", mas cuidado com produção
    credentials: true, // se estiver usando cookies/autenticação
  })
);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SECRET_PASS_SESSION || "morango_e_banana",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

app.use("/uploads", express.static("./updates"))

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/profile", ValidateAuth, UsuarioRoutes);
app.use("/api/v1/endereco", ValidateAuth, EnderecoRoutes);
app.use("/api/v1/produto", ProdutoRoutes);
/* app.use("/api/v1/order")
app.use("/api/v1/avaliacao") */

app.listen(3000, () => console.log("Servidor rodando na porta 3000..."));
