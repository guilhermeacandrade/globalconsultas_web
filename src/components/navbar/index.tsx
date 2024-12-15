"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AvatarUser } from "./avatar_user";

export function Navbar() {
  const { isMobile } = useSidebar();

  return (
    <nav className="h-16">
      <div
        className={cn(
          "flex h-full items-center rounded-lg border border-border bg-sidebar p-1 text-sidebar-foreground shadow duration-200"
        )}
      >
        {isMobile && (
          <div className="flex items-center gap-1">
            <SidebarTrigger className="hover:bg-primary hover:text-sidebar rounded-xl" />
            <Image
              src={"/assets/logo.png"}
              alt="Grupo FR Facilities"
              className="mx-auto"
              width={40}
              height={10}
            />
          </div>
        )}

        <div className="flex flex-grow justify-end items-center h-full">
          <AvatarUser />
        </div>
      </div>
    </nav>
  );
}
