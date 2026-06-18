const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if(email === "admin@insurance.com" && password === "admin123"){
        res.send("Login Successful");
    } else {
        res.send("Invalid Credentials");
    }
});

app.listen(3000, () => {
    console.log("Insurance App Running on Port 3000");
});
