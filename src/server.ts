// import app from "./app";
// import dotenv from 'dotenv';
// dotenv.config()

// app.get('/',(req,res)=>{
    
//     res.send('server is running in port' +  process.env.PORT)
// })
// app.listen(process.env.PORT,()=>{
//     console.log('server is running in port '+ process.env.PORT);
    
// })







import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/authRoutes";
import mongoose from "mongoose";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.DB_URI || "mongodb://127.0.0.1:27017/auth-mvc")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
