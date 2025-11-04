import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import Constants from "expo-constants";
import { Platform } from "react-native";
import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.length > 0) {
    return envUrl.replace(/\/$/, "");
  }

  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }

  const hostUri: string | undefined = (Constants as any)?.expoConfig?.hostUri
    ?? (Constants as any)?.manifest2?.extra?.expoGo?.developer?.host
    ?? (Constants as any)?.manifest?.debuggerHost;

  if (hostUri && typeof hostUri === "string") {
    const uri = hostUri.split("/")[0];
    const [hostPart, portPart] = uri.split(":");
    const host = hostPart ?? "localhost";
    const port = portPart && /^(\d+)$/.test(portPart) ? portPart : undefined;

    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
    const isLocalhost = host === "localhost" || host.endsWith(".local");
    const protocol = isIp || isLocalhost ? "http" : "https";

    return `${protocol}://${host}${port ? `:${port}` : ""}`.replace(/\/$/, "");
  }

  return "http://localhost:8081";
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
