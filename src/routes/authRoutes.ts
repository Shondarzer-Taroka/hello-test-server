// import express from "express";
// import { register, login } from "../controllers/authController";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;










// // // authRoutes.ts
// import express from "express";
// import { register, login } from "../controllers/authController";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;












import express from "express";
import passport from "../config/passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Google Login Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Authentication failed" });

    const token = jwt.sign({ id: (req.user as any).id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

export default router;
