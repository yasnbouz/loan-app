import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production";

const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: process.env.SITE_URL, secure: true } : {}),
  },
});

export const themeSessionResolver = createThemeSessionResolver(themeSessionStorage);

// session for user request loan form

export const loanSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "loanMetaData",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    secrets: ["ef8e4f"],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: process.env.SITE_URL, secure: true } : {}),
  },
});
