import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const userInfo = (req: Request, res: Response): void => {
  const token = req.cookies?.authToken; // Access 'authToken' cookie instead of 'token'
  console.log(token);  // For debugging

  if (!token) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    res.json({ user: decoded });
    return;
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
