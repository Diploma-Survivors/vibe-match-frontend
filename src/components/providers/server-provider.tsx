// app/ServerProvider.tsx
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { DecodedAccessToken, UserInfo } from "@/types/states";
import { ClientProvider } from "./client-provider";
import { authOptions } from "@/lib/auth"; 

interface ServerProviderProps {
  children: ReactNode;
}

export async function ServerProvider({ children }: ServerProviderProps) {
  const session = await getServerSession(authOptions);

  let initialUser: UserInfo | null = null;
  let initialIssuer: "local" | "moodle" = "local";

  if (session?.accessToken) {
    try {
      const decoded: DecodedAccessToken = jwtDecode(session.accessToken);

      initialUser = {
        userId: decoded.userId,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        fullName: `${decoded.firstName} ${decoded.lastName}`.trim(),
        roles: decoded.roles || [],
      };

      initialIssuer = decoded.iss?.includes("local") ? "local" : "moodle";
    } catch (err) {
      console.error("❌ Failed to decode access token:", err);
    }
  }

  return (
    <ClientProvider initialUser={initialUser} initialIssuer={initialIssuer}>
      {children}
    </ClientProvider>
  );
}
