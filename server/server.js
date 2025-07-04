import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import uploadRoutes from "./routes/upload.js"
import fetchRoutes from "./routes/fetch.js"

const app = express();
const prisma = new PrismaClient();
const PORT = 8080;

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,          // true in production
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "lax",
    },
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: false,
    }),
}));

app.use("/auth", authRoutes);
app.use("/", uploadRoutes); 
app.use("/fetch", fetchRoutes);

app.listen(PORT, () => {
    console.log("server started");
});