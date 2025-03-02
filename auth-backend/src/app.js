const express = require("express");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Add this line
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Configure CORS to allow requests from your frontend
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.get("/", (req, res) => {
  res.send("Backend Ready");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
