import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import uploadRoutes from "./routes/upload.js"
import fetchRoutes from "./routes/fetch.js"
import fileActionRoutes from "./routes/fileActions.js"

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "none",
    },
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordExpiration: true,
    }),
}));

app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes); 
app.use("/fetch", fetchRoutes);
app.use("/action", fileActionRoutes);

app.listen(PORT, () => {
    console.log("server started");
});