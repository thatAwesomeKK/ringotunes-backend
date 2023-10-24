import "dotenv/config.js";
import express from "express";
const app = express();
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 5000;
import { connectToMongo } from "./src/config/db.js";
import authRouter from "./src/routes/auth.js";
import ringRouter from "./src/routes/ringtones.js";
import userRouter from "./src/routes/user.js";
import passport from "passport";
import { passportConfig } from "./src/config/passport.js";
passportConfig(passport);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

//Routes
app.use("/auth", authRouter);
app.use("/ring", ringRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

//serves the application at the defined port if Connected to MongoDB
connectToMongo()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log("Connected to MongoDB");
        console.log(`Server is running on : http://localhost:${PORT}`);
      });
    } catch (error) {
      console.log("Cannot Connect to Server");
    }
  })
  .catch((e) => {
    console.log("Error In Connecting to Server!");
  });
