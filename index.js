import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import admin from "firebase-admin";

import serviceAccount from "./path/to/serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

dotenv.config();

const app = express();
const port = 3030;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).send('Unauthorized');
    }
  } else {
    return res.status(401).send('Unauthorized');
  }
});

app.use("/questions", questionRoutes);
app.use("/users", userRoutes);
app.use("/get_questions", questionRoutes);
app.use("/get_categories", questionRoutes);
app.use("/submit_quiz", questionRoutes);

const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const dbName = "quiz";

async function startServer() {
  try {
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@cluster0.y0r6j1d.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB");

    app.listen(port, () => console.log("Server Started on port " + port));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();
