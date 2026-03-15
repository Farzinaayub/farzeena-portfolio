import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const app: Express = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

// better-auth handles its own body parsing for /api/auth/*
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
