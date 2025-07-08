import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useThemedStyles } from "../hooks/useTheme";
import { useHydratedTranslation } from "../hooks/useHydratedTranslation";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Handle source map requests (from browser dev tools)
  if (url.pathname.endsWith(".map")) {
    return new Response(null, { status: 404 });
  }

  // Throw 404 for all other requests - will be caught by ErrorBoundary
  throw new Response("Not Found", { status: 404 });
}

export function ErrorBoundary() {
  const { colors } = useThemedStyles();
  const { t } = useHydratedTranslation();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          404 - {t("pageNotFound")}
        </h1>
        <p style={{ marginBottom: "2rem", color: colors.text.secondary }}>
          {t("pageNotFoundDescription")}
        </p>
        <Link
          to="/"
          style={{
            color: colors.text.link,
            textDecoration: "underline",
            fontSize: "1.1rem",
          }}
        >
          {t("goBackHome")}
        </Link>
      </div>
    </div>
  );
}

export default function SplatRoute() {
  // This should never render since we always throw in the loader
  return null;
}
