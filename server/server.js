const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = 8080;

app.get("/api", (req, res) => {
    res.json({"message": "heyaaaaaa"});
});

app.listen(PORT, () => {
    console.log("server started");
});