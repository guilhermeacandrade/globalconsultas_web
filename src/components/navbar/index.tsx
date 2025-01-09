"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AvatarUser } from "./avatar_user";

export function Navbar() {
  const { isMobile, state } = useSidebar();

  return (
    <nav
      className={cn("h-16 fixed w-full pr-2 pt-2 z-40 bg-background", {
        "px-2": state === "expanded",
      })}
    >
      <div
        className={cn(
          "flex h-full items-center rounded-lg border border-border bg-sidebar p-1 text-sidebar-foreground shadow duration-200",
          "md:ml-[--sidebar-width]",
          {
            // "md:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]":
            "md:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.2))]":
              state === "collapsed",
          }
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
