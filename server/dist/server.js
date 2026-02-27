import express from "express";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./configs/db.js";
import AuthRouter from "./routes/AuthRouthes.js";

const app = express();

// ✅ CORS: include your Vercel frontend domain too
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ai-thumbnail-navy.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "none",  // ✅ needed for cross-site cookies on Vercel
      secure: true       // ✅ required when sameSite is none
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
  })
);

// ✅ connect DB once (cache)
let dbReady = false;
async function ensureDB() {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }
}

app.get("/", async (req, res) => {
  await ensureDB();
  res.send("Server is Live!");
});

app.use("/api/auth", async (req, res, next) => {
  await ensureDB();
  next();
}, AuthRouter);

export default app;
