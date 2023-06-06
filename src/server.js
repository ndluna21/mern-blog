import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: path.join(__dirname, "../.env") });
import postRoutes from "./routes/postRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import searchRoutes from './routes/searchRoutes';
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
// import connectDB from "./db/dbConfig";
import passport from "passport";
import { passport as passportMiddleware } from "./middlewares/passport";
import menuRoutes from "./routes/menuRoutes";

const app = express();

const port = process.env.PORT || 5000;
console.log('--------------- PORT: ', port);

// Connect DB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.URL_DB, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log(`Connection Successfull `))
    .catch(err => console.log(`Error in DB connection ${err}`));
// END

function setupServer() {
  // connectDB();
  middlewares();
  app.use("/api/posts", postRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/menus", menuRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/search", searchRoutes)
  app.use("/api/auth", authRoutes);
  app.use(express.static(path.join(__dirname, "./../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./../client/build", "index.html"));
  });
}

function middlewares() {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // Passport middleware
  app.use(passport.initialize());
  passportMiddleware;
}

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

setupServer();
