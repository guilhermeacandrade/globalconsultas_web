/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { cn } from "@/lib/utils";
import {
  IInquiry,
  IResultInquiries,
  RESULT_INQUIRY_LABELS,
} from "@/utils/types/inquiry.type";
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
import {
  Circle,
  Crown,
  Edit2,
  MoreHorizontal,
  ShieldBan,
  ShieldCheck,
  ShieldEllipsis,
  User,
  UserRoundSearch,
} from "lucide-react";
import { DialogInquiry } from "../dialog_inquiry";
import { BadgeResultInquiry } from "../badge_result_inquiry";

export const columns: ColumnDef<IInquiry>[] = [
  {
    accessorKey: "code",
    header: "Código",
    meta: {
      headerClassName: "text-xs",
    },
    cell: ({ row: { original: inquiry } }) => {
      const requestDateISO = new Date(inquiry.requestDate);

      return (
        <div className="w-20 max-w-20 text-xs text-center">
          <span className="">
            {requestDateISO.getUTCFullYear()}
            {String(requestDateISO.getUTCMonth() + 1).padStart(2, "0")}
            {String(requestDateISO.getUTCDate()).padStart(2, "0")}-
            {String(inquiry.code).padStart(6, "0")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "requestDate",
    header: "Data da Solicitação",
    meta: {
      headerClassName: "w-20 text-xs",
    },
    cell: ({ row: { original: inquiry } }) => {
      const requestDateISO = new Date(inquiry.requestDate);
      const requestDate = new Date(
        requestDateISO.getUTCFullYear(),
        requestDateISO.getUTCMonth(),
        requestDateISO.getUTCDate()
      );

      return (
        <div className="flex">
          <span className="text-xs text-center">
            {new Date(requestDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      );
    },
  },

  {
    // accessorKey: "",
    id: "name",
    header: "Candidato",
    meta: {
      headerClassName: "text-xs",
    },
    cell: ({ row: { original: inquiry } }) => {
      return <div className="text-xs">{inquiry.person.name}</div>;
    },
  },

  {
    // accessorKey: "",
    id: "filial",
    header: "Filial",
    meta: {
      headerClassName: "text-xs",
      cellClassName: "h-16",
    },
    cell: ({ row: { original: inquiry } }) => {
      return <div className="text-xs">{inquiry.person.branch.fantasyName}</div>;
    },
  },

  {
    accessorKey: "investigator",
    // id: "filial",
    header: "Consultor",
    meta: {
      headerClassName: "w-40 text-xs  flex justify-center items-center",
    },
    cell: ({ row: { original: inquiry } }) => {
      if (!inquiry.investigator) return null;

      return (
        <div className="flex items-center justify-center text-xs gap-1 w-full max-w-40 bg-muted rounded-full px-4 py-1">
          <UserRoundSearch size={16} />
          <span className="text-ellipsis overflow-hidden">
            {inquiry.investigator?.name}
          </span>
        </div>
      );
    },
  },

  // {
  //   // accessorKey: "",
  //   id: "status",
  //   header: "Status",
  //   meta: {
  //     headerClassName: "w-24",
  //   },
  //   cell: ({ row: { original: inquiry } }) => {
  //     return (
  //       <div className="">
  //         <span>{inquiry.endDate ? "Finalizada" : "Pendente"}</span>
  //       </div>
  //     );
  //   },
  // },

  {
    accessorKey: "result",
    header: "Resultado",
    meta: {
      headerClassName: "w-36 text-xs",
    },
    cell: ({ row: { original: inquiry } }) => {
      return BadgeResultInquiry({
        inquiryResult: inquiry.result,
        inquiryInvestigator: !!inquiry.investigatorId,
      });
    },
  },

  {
    id: "actions",
    meta: {
      headerClassName: "w-12 text-xs",
    },
    cell: ({ row: { original: inquiry } }) => {
      return (
        <div className="flex items-center gap-2 justify-end">
          {/* {!inquiry.investigatorId && !inquiry.result && (
          )} */}
          <DialogInquiry
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
            dialogTitle="Editando Consulta"
            editInquiry={inquiry}
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
