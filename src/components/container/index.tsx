import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="w-full p-2 pt-16">{children}</div>;
}
