import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB";
import Routes from "./routes/userRoute";

dotenv.config();

import { corsOptions } from "./middleware/corsOptionConfiguration";
console.log(corsOptions)
import cookieParser from "cookie-parser";
import codeRoute from "./routes/codeRoute";
import rateLimit from "express-rate-limit";
import { injectedCodeController } from "@/di/codeInjection";
import { ERROR_MESSAGES } from "./shared/constant";



connectDB();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Rate limiter for redirection
const redirectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: {
    success: false,
    message: ERROR_MESSAGES.TOO_MANY_REQUESTS
  },
});

// Rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per IP
  message: {
    success: false,
    message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  },
});


// Redirect route for shortened URLs
app.get("/:shortCode", redirectLimiter, (req, res) => {
  injectedCodeController.redirectUrl(req, res);
});

// Routes
app.use("/",authLimiter,Routes);
app.use("/code", codeRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});