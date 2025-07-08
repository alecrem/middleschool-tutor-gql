import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { i18nConfig } from "./i18n";
import { translations } from "./lib/translations";

// Initialize i18n for server-side rendering
if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    ...i18nConfig,
    resources: translations,
  });
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
