"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Navbar() {
  const { isMobile } = useSidebar();

  return (
    <nav className="h-16">
      <div
        className={cn(
          "flex h-full items-center rounded-lg border border-border bg-sidebar px-2 text-sidebar-foreground shadow duration-200"
          // "md:ml-[--sidebar-width]",
          // {
          //   "md:ml-[calc(var(--sidebar-width-icon))]": state === "collapsed",
          // }
          // "bg-background border-none shadow-none"
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

        <div className="flex flex-grow justify-end gap-4"></div>
      </div>
    </nav>
    // <nav className={cn("fixed z-40 h-20 w-full bg-background p-2")}>
    //   <div
    //     className={cn(
    //       "flex h-full items-center rounded-lg border border-border bg-sidebar px-2 text-sidebar-foreground shadow duration-200",
    //       "md:ml-[--sidebar-width]",
    //       {
    //         "md:ml-[calc(var(--sidebar-width-icon))]": state === "collapsed",
    //       }
    //       // "bg-background border-none shadow-none"
    //     )}
    //   >
    //     {isMobile && (
    //       <div className="flex items-center gap-1">
    //         <Image
    //           src={"/assets/logo.png"}
    //           alt="Grupo FR Facilities"
    //           className="mx-auto"
    //           width={40}
    //           height={10}
    //         />
    //         <SidebarTrigger />
    //       </div>
    //     )}

    //     <div className="flex flex-grow justify-end gap-4"></div>
    //   </div>
    // </nav>
  );
}
