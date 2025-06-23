import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { i18nConfig } from "./i18n";

// Initialize i18n for server-side rendering
if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    ...i18nConfig,
    resources: {
      en: {
        common: {
          title: "MTG Middle School",
          description:
            "Search and explore Magic: The Gathering cards legal in the Middle School format",
          searchCards: "Search Cards",
          searchPlaceholder: "Search for cards...",
          search: "Search",
          searching: "Searching...",
          searchError: "Failed to search cards. Please try again.",
          foundCards: 'Found {{total}} cards for "{{query}}"',
          foundCardsPartial:
            'Found {{total}} cards for "{{query}}" — showing the first {{shown}}',
          enterCardName: "Enter a card name to get started",
        },
      },
      ja: {
        common: {
          title: "MTG Middle School",
          description:
            "Middle School フォーマットで使用可能なマジック：ザ・ギャザリングのカードを検索・探索",
          searchCards: "カード検索",
          searchPlaceholder: "カードを検索...",
          search: "検索",
          searching: "検索中...",
          searchError: "カードの検索に失敗しました。もう一度お試しください。",
          foundCards: "「{{query}}」で{{total}}枚のカードが見つかりました",
          foundCardsPartial:
            "「{{query}}」で{{total}}枚のカードが見つかりました — 最初の{{shown}}枚を表示",
          enterCardName: "カード名を入力して開始してください",
        },
      },
    },
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

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
