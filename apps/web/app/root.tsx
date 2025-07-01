import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BodyStyle } from "./components/BodyStyle";
import { Analytics } from "@vercel/analytics/remix";

export default function App() {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              overflow-x: hidden;
              transition: background-color 0.2s ease, color 0.2s ease;
            }
            @media (max-width: 640px) {
              body {
                font-size: 14px;
              }
              .card-layout {
                flex-direction: column !important;
              }
              .card-image {
                width: 200px !important;
                height: 280px !important;
                max-width: 60vw !important;
                align-self: center !important;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              * {
                transition: none !important;
              }
            }
          `,
          }}
        />
        <ThemeProvider>
          <BodyStyle />
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}
