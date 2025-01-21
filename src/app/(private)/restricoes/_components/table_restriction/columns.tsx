/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { cn } from "@/lib/utils";
import {
  IRestriction,
  IRestrictionTypes,
  RESTRICTION_TYPES_LABELS,
} from "@/utils/types/restriction.type";
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
import { DialogRestriction } from "../dialog_restriction";

export const columns: ColumnDef<IRestriction>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
    meta: {
      headerClassName: "w-28",
    },
    cell: ({ row: { original: restriction } }) => {
      return (
        <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-xl bg-muted text-xs font-normal text-foreground ">
          {RESTRICTION_TYPES_LABELS[restriction.type]}
        </div>
      );
    },
  },

  {
    accessorKey: "article",
    header: "Artigo",
  },

  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row: { original: restriction } }) => {
      return (
        <div className="max-h-14 text-ellipsis overflow-hidden line-clamp-3">
          {restriction.description}
        </div>
      );
    },
  },

  {
    id: "actions",
    meta: {
      headerClassName: "w-12",
    },
    cell: ({ row: { original: restriction } }) => {
      return (
        <div className="flex items-center gap-2 justify-end">
          <DialogRestriction
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
            dialogTitle="Editando Usuário"
            editRestriction={restriction}
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
