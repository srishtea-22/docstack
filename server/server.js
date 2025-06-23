import express from "express";
import cors from "cors";
import authRoutes from "./routes/signup.js"
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8080;

app.use("/signup", authRoutes);

app.get("/", (req, res) => {
    res.json({"message": "heyaaaaaa"});
});

app.listen(PORT, () => {
    console.log("server started");
});