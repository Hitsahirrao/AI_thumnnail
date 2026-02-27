import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import AuthRouter from './routes/AuthRouthes.js';
import ThumbnailRouter from './routes/ThumbnailRoutes.js';
import UserRouter from './routes/UserRoutes.js';

// ...your imports
await connectDB();

const app = express();

// needed behind Vercel proxy for cookies/sessions
app.set("trust proxy", 1);

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
  origin: clientUrl,
  credentials: true
}));

app.use(express.json());

const isProd = process.env.NODE_ENV === "production";

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI as string,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: isProd,                 // ✅ true on https
    sameSite: isProd ? "none" : "lax"// ✅ needed if frontend+backend are on different domains
  }
}));

app.get("/", (req, res) => res.send("Server is Live!"));

app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);
app.use("/api/user", UserRouter);

// ✅ only listen locally (not on Vercel)
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on ${port}`));
}

export default app;