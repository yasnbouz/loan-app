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
    secrets: ["36b797ec-30d6-45a9-9d63-8aac94d4d8fd"],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: process.env.SITE_DOMIN, secure: true } : {}),
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
    secrets: ["e92651d1-c5c2-41ef-acb4-a20078afe775"],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: process.env.SITE_DOMIN, secure: true } : {}),
  },
});
