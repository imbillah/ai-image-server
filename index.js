import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import postRoute from "./routes/post.js";
import dalleRoute from "./routes/dall_e.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// server config & connection
const connectDB = () => {
  mongoose.set("strictQuery", true);
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Server connected");
  } catch (error) {
    console.log(error.message);
  }
};
app.listen(7000, () => {
  connectDB();
  console.log("Serving is running on port 7000");
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongo server disconnected");
});

// Routes
app.get("/", async (req, res) => {
  res.send("<h1>Hello From Ai</h1>");
});

app.use("/api/posts", postRoute);
app.use("/api/generate", dalleRoute);

// error handler middleware
app.use((err, req, res, next) => {
  if (err.message) {
    res.status(500).send(err.message);
  } else {
    res.status(500).send("An error happened! Try Again");
  }
});
