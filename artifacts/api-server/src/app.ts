import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import authRoutesRouter from "./routes/auth-routes.js";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom auth routes must be registered BEFORE better-auth's catch-all handler
// so they are reached first by Express's route matching
app.use("/api/auth", authRoutesRouter);

// better-auth handles its own internal routes (callbacks, session refresh, etc.)
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api", router);

export default app;
