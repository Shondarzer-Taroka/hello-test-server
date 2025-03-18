
// // // authController.ts
// import { Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User";

// // Extend Request to include user
// interface AuthenticatedRequest extends Request {
//   user?: any; // Replace `any` with your actual User type if defined
// }

// // Generate Token
// const generateToken = (id: string) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
// };

// // @desc   Register new user
// // @route  POST /api/auth/register
// // @access Public
// export const register = asyncHandler(async (req: Request, res: Response) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     res.status(400);
//     throw new Error("All fields are required");
//   }

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = await User.create({ username, email, password: hashedPassword });

//   res.status(201).json({ message: "User registered successfully", user: newUser });
// });

// // @desc   Login user
// // @route  POST /api/auth/login
// // @access Public
// export const login = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     res.status(400);
//     throw new Error("All fields are required");
//   }

//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(400);
//     throw new Error("User not found");
//   }

//   // Prevent login with password if the user registered via Google
//   if (!user.password) {
//     res.status(400);
//     throw new Error("User registered with Google. Please login with Google.");
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     res.status(400);
//     throw new Error("Invalid credentials");
//   }

//   const token = generateToken(user.id);
//   res.json({ token, user });
// });


// // @desc   Google Login Callback
// // @route  GET /api/auth/google/callback
// // @access Public
// export const googleAuthCallback = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
//   if (!req.user) {
//     res.status(401);
//     throw new Error("Unauthorized: No user data found");
//   }

//   const token = generateToken(req.user.id);
//   res.redirect(`http://localhost:5173?token=${token}`); // Redirect to your React app
// });























import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Extend Request to include user
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Generate Token
const generateToken = (user: object) => {
  console.log('gentoken',user);
  
  return jwt.sign(user, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
};

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword });

  res.status(201).json({ message: "User registered successfully", user: newUser });
});

// @desc   Login user & set cookie
// @route  POST /api/auth/login
// @access Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  // Prevent login with password if the user registered via Google
  if (!user.password) {
    res.status(400);
    throw new Error("User registered with Google. Please login with Google.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }
  
  const token = generateToken({
    email: user.email,
    username: user.username,  // Include other user-specific details here (but not password)
  });

  res
    .cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    .json({ message: "Login successful", user });
});

// @desc   Google Login Callback
// @route  GET /api/auth/google/callback
// @access Public
export const googleAuthCallback = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized: No user data found");
  }
   console.log(req.user);
   
  const token = generateToken({
    email: req.user.email,
    username: req.user.username, 
  });

  res
    .cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    .redirect("http://localhost:5173");
});

// @desc   Logout user & clear cookie
// @route  POST /api/auth/logout
// @access Private
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("authToken").json({ message: "Logged out successfully" });
});

