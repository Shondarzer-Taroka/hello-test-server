// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
// import bcrypt from "bcryptjs";
// import User from "../models/User";
 
// passport.use(
//   new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
//     try {
//       const user = await User.findOne({ email });
//       if (!user) return done(null, false, { message: "User not found" });

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) return done(null, false, { message: "Invalid credentials" });

//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   })
// );

// passport.use(
//   new JWTStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET || "secret",
//     },
//     async (payload, done) => {
//       try {
//         const user = await User.findById(payload.id);
//         if (!user) return done(null, false);
//         return done(null, user);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );









import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails?.[0].value,
            password: "", // Google users don't need a password
          });
        }

        done(null, user);
      } catch (err) {
        done(err, undefined); // ✅ Fix: Change null to undefined
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || undefined); // ✅ Ensure user is either User or undefined
  } catch (err) {
    done(err, undefined);
  }
});

export default passport;
