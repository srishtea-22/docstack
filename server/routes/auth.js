import express from "express";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

const userSchema = z.object({
  username: z.string().min(1, {message: "Username is required"}),
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
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

export default router;