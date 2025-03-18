

// import express from "express";
// import passport from "../config/passport";
// import { register, login, googleAuthCallback } from "../controllers/authController";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// // Google OAuth Routes
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   googleAuthCallback
// );

// export default router;
















import express from "express";
import passport from "../config/passport";
import { register, login, googleAuthCallback, logout } from "../controllers/authController";
import { userInfo } from "../cookie/Cuser";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

router.get('/userInfo',userInfo)

export default router;

