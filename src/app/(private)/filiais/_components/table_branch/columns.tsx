/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit2, MoreHorizontal } from "lucide-react";
import { DialogBranch } from "../dialog_branch";
import { IBranch } from "@/utils/types/branch.type";

export const columns: ColumnDef<IBranch>[] = [
  {
    accessorKey: "fantasyName",
    header: "Filial",
  },

  {
    id: "actions",
    meta: {
      headerClassName: "w-12",
    },
    cell: ({ row: { original: branch } }) => {
      return (
        <div className="flex items-center gap-2">
          <DialogBranch
            trigger={
              <button className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Edit2 size={12} />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Editar</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            }
            dialogTitle="Editando Filial"
            editBranch={branch}
          />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger className="rounded-full p-2 hover:bg-muted hidden">
                  <MoreHorizontal size={12} />
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Mais Opções</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem
                className={cn(
                  "focus:bg-gradient-to-r focus:from-primary focus:to-primary/70 focus:text-sidebar-accent",
                  "text-xs"
                )}
              >
                menu 1
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
