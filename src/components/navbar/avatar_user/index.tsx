"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, LogOut } from "lucide-react";

export function AvatarUser() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-2 text-primary hover:bg-primary/5 h-full items-center py-2 px-3 rounded-md hover:cursor-pointer">
          <div className="flex flex-col items-end justify-center">
            <span className="text-base font-semibold">
              {session?.user?.name}
            </span>
            <span className="text-xs font-light">{session?.user?.email}</span>
          </div>

          <CircleUserRound size={32} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild className="hover:text-destructive">
          <button
            // variant={"ghost"}
            className="w-full space-x-2 text-destructive focus:bg-destructive/5 focus:text-destructive"
            onClick={() => signOut({ redirectTo: "/signin" })}
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
