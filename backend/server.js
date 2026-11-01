require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const urlRoute = require("./routes/url.routes");
const indexRoute = require("./routes/index.routes");
const authRoute = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");



const app = express();
app.use(express.json());


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
    console.log("Incoming request:" , req.method, req.url);
    next();
})

app.get("/auth-test", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Authentication successfull",
        user: req.user,
    });
});

    

connectDB();

app.use("/" , indexRoute);
app.use("/url", urlRoute);
app.use("/auth" , authRoute);



app.listen(3000, (req,res) => {
    console.log("express is working");
    

});