export const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGIN||'https://url-shortner-lemon-nine.vercel.app/',
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
