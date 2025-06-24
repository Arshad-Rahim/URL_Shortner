export const corsOptions = {
  origin:
    process.env.CORS_ALLOWED_ORIGIN ||
    "https://url-shortner-lemon-nine.vercel.app",
  // 'http://localhost:5173',

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
