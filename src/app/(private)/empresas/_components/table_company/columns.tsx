/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { cn } from "@/lib/utils";
import { ICompany } from "@/utils/types/company.type";
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

export const columns: ColumnDef<ICompany>[] = [
  {
    accessorKey: "name",
    header: "Empresa",
  },

  {
    id: "actions",
    meta: {
      headerClassName: "w-12",
    },
    cell: ({ row: { original: company } }) => {
      return (
        // <div className="flex items-center">
        //   <button className="rounded-full p-2 hover:bg-muted">
        //     <FiMoreHorizontal size={12} />
        //   </button>
        // </div>

        // <Menubar className={cn("border-0 bg-inherit p-0")}>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger className="rounded-full p-2 hover:bg-muted">
                <MoreHorizontal size={12} />
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Opções</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem
              className={cn(
                "focus:bg-gradient-to-r focus:from-primary focus:to-primary/70 focus:text-sidebar-accent",
                "text-xs"
              )}
            >
              <button className="flex items-center gap-2">
                <Edit2 size={12} />
                <span>Editar</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
