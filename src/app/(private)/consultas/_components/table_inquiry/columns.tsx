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
} from "lucide-react";
import { DialogInquiry } from "../dialog_inquiry";

export const columns: ColumnDef<IInquiry>[] = [
  {
    accessorKey: "code",
    header: "Código",
    meta: {
      headerClassName: "w-40 ",
    },
    cell: ({ row: { original: inquiry } }) => {
      const requestDateISO = new Date(inquiry.requestDate);

      return (
        <span>
          {requestDateISO.getUTCFullYear()}
          {String(requestDateISO.getUTCMonth() + 1).padStart(2, "0")}
          {String(requestDateISO.getUTCDate()).padStart(2, "0")}-
          {String(inquiry.code).padStart(6, "0")}
        </span>
      );
    },
  },
  {
    accessorKey: "requestDate",
    header: "Data da Solicitação",
    meta: {
      headerClassName: "w-48",
    },
    cell: ({ row: { original: inquiry } }) => {
      const requestDateISO = new Date(inquiry.requestDate);
      const requestDate = new Date(
        requestDateISO.getUTCFullYear(),
        requestDateISO.getUTCMonth(),
        requestDateISO.getUTCDate()
      );

      return (
        <span>
          {new Date(requestDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  {
    // accessorKey: "",
    id: "name",
    header: "Candidato",
    cell: ({ row: { original: inquiry } }) => {
      return <div className="">{inquiry.person.name}</div>;
    },
  },

  {
    // accessorKey: "",
    id: "filial",
    header: "Filial",

    cell: ({ row: { original: inquiry } }) => {
      return <div className="">{inquiry.person.branch.fantasyName}</div>;
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
      headerClassName: "w-36",
    },
    cell: ({ row: { original: inquiry } }) => {
      return (
        <div
          className={cn(
            "flex w-full  max-w-32 items-center justify-center px-2 py-0 gap-2 text-xs rounded-xl bg-amber-300/40 text-amber-600",
            {
              "bg-green-500/10 text-green-500":
                inquiry.result === IResultInquiries.APPROVED,
            },
            {
              "bg-red-500/10 text-red-500":
                inquiry.result === IResultInquiries.REJECTED,
            }
          )}
        >
          <div className="">
            {inquiry.result === IResultInquiries.APPROVED && (
              <ShieldCheck size={12} />
            )}
            {inquiry.result === IResultInquiries.REJECTED && (
              <ShieldBan size={12} />
            )}
            {inquiry.result !== IResultInquiries.APPROVED &&
              inquiry.result !== IResultInquiries.REJECTED && (
                <ShieldEllipsis size={12} />
              )}
          </div>

          <span className="f">
            {inquiry.result
              ? RESULT_INQUIRY_LABELS[inquiry.result]
              : "Aguardando"}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    meta: {
      headerClassName: "w-12",
    },
    cell: ({ row: { original: inquiry } }) => {
      return (
        <div className="flex items-center gap-2 justify-end">
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
