const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const http = require("http");

const { initializeSocket } = require("./config/socket");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dev-tinder-frontend-two-phi.vercel.app",
    ],
    credentials: true,
  }),
);

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("DevTinder Backend is running 🚀");
});

const auth = require("./routes/auth");
const profile = require("./routes/profile");
const connectionrequest = require("./routes/connectionrequest");
const user = require("./routes/user");

app.use("/", auth);
app.use("/", profile);
app.use("/", connectionrequest);
app.use("/", user);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Connected success fully");
    server.listen(process.env.PORT, () => {
      console.log("Server running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Can not connect...");
  });
