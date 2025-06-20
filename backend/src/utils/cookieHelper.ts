import { Response } from "express";

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 75 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const updateCookieWithAccessToken = (
  res: Response,
  accessToken: string,
) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "lax" : "none",
    path: "/",
    maxAge: 75 * 60 * 1000,
  });
};

export const clearAuthCookies = (
  res: Response,
) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};