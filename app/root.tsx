import type { LinksFunction, LoaderFunctionArgs } from "@vercel/remix";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError, useRouteLoaderData } from "@remix-run/react";
import styles from "./styles/tailwind.css?url";
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes";
import { themeSessionResolver } from "./.server/sessions";
import { cn } from "@/lib/utils";
import { createClient } from "@/.server/supabase";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/shared/layout";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preload", as: "font", href: "/fonts/InterVariable-subset.woff2", type: "font/woff2", crossOrigin: "anonymous" },
];

// Return the theme from the session storage using the loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);

  const { supabase } = createClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    theme: getTheme(),
    session,
  };
}
// Wrap your app with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const { theme: serverTheme, session } = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html lang="es" className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(serverTheme)} />
        <Links />
      </head>
      <body>
        <Outlet context={session} />
        <Toaster expand richColors position="top-center" closeButton />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const data = useRouteLoaderData<typeof loader>("root");
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <ErrorBoundaryChild />
    </ThemeProvider>
  );
}

function ErrorBoundaryChild() {
  const error = useRouteError();
  const data = useRouteLoaderData<typeof loader>("root");
  const [theme] = useTheme();

  return (
    <html lang="es" className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Layout>
          <div className="max-w-2xl mx-auto p-4 border">
            <h1 className="text-4xl text-destructive">Error: {error.message}</h1>
          </div>
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
