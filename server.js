const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const members = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (
        email === "admin@insurance.com" &&
        password === "admin123"
    ) {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "dashboard.html"
            )
        );

    } else {

        res.send("Invalid Credentials");

    }

});

app.get("/add-member",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "add-member.html"
        )
    );

});

app.post("/add-member",(req,res)=>{

    members.push(req.body);

    res.send(`
        <h1>Member Added Successfully</h1>

        <a href="/members">
            View Members
        </a>
    `);

});

app.get("/members",(req,res)=>{

    let html = `
    <html>
    <head>
    <title>Members</title>
    </head>
    <body>

    <h1>Insurance Members</h1>

    <table border="1" cellpadding="10">

    <tr>
        <th>Name</th>
        <th>Mobile</th>
        <th>Age</th>
        <th>Gender</th>
        <th>Relationship</th>
    </tr>
    `;

    members.forEach(member => {

        html += `
        <tr>
            <td>${member.name}</td>
            <td>${member.mobile}</td>
            <td>${member.age}</td>
            <td>${member.gender}</td>
            <td>${member.relationship}</td>
        </tr>
        `;

    });

    html += `
    </table>

    <br>

    <a href="/dashboard.html">
        Dashboard
    </a>

    </body>
    </html>
    `;

    res.send(html);

});

app.listen(3000, () => {
    console.log("Insurance App Running on Port 3000");
});
