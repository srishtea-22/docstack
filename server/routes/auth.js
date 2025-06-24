import express from "express";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

const userSchema = z.object({
  username: z.string().min(1, {message: "Username is required"}),
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
});

const loginSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(1),
});

router.post('/signup', async (req, res) => {
    try {
        const {username, email, password} = userSchema.parse(req.body);

        const existingUseremail = await prisma.user.findUnique({
            where: {email: email}
        })
        if (existingUseremail) {
            return res.status(409).json({
                user: null,
                message: "User with this email already exists"
            })
        }
        const existingUsername = await prisma.user.findUnique({
            where: {username: username}
        })
        if (existingUsername) {
            return res.status(409).json({
                user: null,
                message: "User with this username already exists"
            })
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        res.status(201).json({
            message: "user created successfully",
            user: newUser
        })
    }
    catch (e){
        console.error("error while post request", e);
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({where: {email}});
        
        if (!user) {
            return res.status(401).json({message: "Invalid credentials", user: null});
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({message: "Invalid credentials", user: null});
        }

        req.session.user = {id: user.id, username: user.username};

        res.status(200).json({message: "Login successful", user: {username: user.username}});
    }
    catch (e) {
        console.error("Login error", e);
        res.status(500).json({message: "Internal server error", user: null});
    }
});

router.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({user: req.session.user});
    }
    else {
        res.status(401).json({user: null, message: "Not logged in"});
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200).json({message: "Logged out"});
    });
});

export default router;