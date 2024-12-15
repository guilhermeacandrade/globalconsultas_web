import { SessionProvider as _SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  return <_SessionProvider>{children}</_SessionProvider>;
}
