/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { cn } from "@/lib/utils";
import { IUser, IUserProfile, PROFILE_LABELS } from "@/utils/types/user.type";
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
import { Circle, Crown, Edit2, MoreHorizontal, User } from "lucide-react";
import { DialogUser } from "../dialog_user";
import { use } from "react";

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },

  {
    accessorKey: "profile",
    header: "Perfil",
    cell: ({ row: { original: user } }) => {
      return (
        <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-xl bg-muted text-xs font-normal text-foreground ">
          {PROFILE_LABELS[user.profile]}
          {user.profile === IUserProfile.ADMIN && (
            <Crown size={12} className="text-primary" />
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "email",
    header: "E-mail",
  },

  {
    id: "access",
    header: "Acessos",
    meta: {
      cellClassName: "h-20",
    },
    cell: ({ row: { original: user } }) => {
      if (user.profile === IUserProfile.ADMIN) {
        return (
          <div className="bg-muted px-3 py-1 text-xs rounded-xl w-fit ">
            Acesso Total
          </div>
        );
      }

      if (user.profile === IUserProfile.COMPANY) {
        return (
          <div className="bg-muted px-3 py-1 text-xs rounded-xl w-fit flex flex-col">
            <span className="font-semibold text-[0.60rem]">Empresa</span>
            <span className="">{user.company?.name}</span>
          </div>
        );
      }

      if (user.profile === IUserProfile.BRANCH) {
        return (
          <div className="bg-muted px-3 py-1 text-xs rounded-xl w-fit flex flex-col">
            <span className="font-semibold text-[0.60rem] text-gray-600">
              Filial {user.branch?.company.name}
            </span>
            <span className="">{user.branch?.fantasyName}</span>
            {user.branch?.city && (
              <span className="font-normal text-[0.55rem] text-gray-600">
                {user.branch?.city} ({user.branch?.uf})
              </span>
            )}
          </div>
        );
      }

      if (user.profile === IUserProfile.INVESTIGATOR) {
        return (
          <div className="bg-muted px-3 py-1 text-xs rounded-xl w-fit">
            Suas Consultas Atribuídas
          </div>
        );
      }
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row: { original: user } }) => {
      return (
        <div
          className={cn(
            "flex w-full max-w-20 items-center justify-center px-2 py-0 gap-2 text-xs rounded-xl",
            {
              "bg-green-500/10 text-green-500": user.status,
            },
            {
              "bg-red-500/10 text-red-500": !user.status,
            }
          )}
        >
          <Circle
            size={8}
            className={cn(
              "rounded-full",
              {
                "bg-green-500 ": user.status,
              },
              {
                "bg-red-500 ": !user.status,
              }
            )}
          />
          {user.status ? "Ativo" : "Inativo"}
        </div>
      );
    },
  },

  {
    id: "actions",
    meta: {
      headerClassName: "w-12",
    },
    cell: ({ row: { original: user } }) => {
      return (
        <div className="flex items-center gap-2 justify-end">
          <DialogUser
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
            editUser={user}
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
