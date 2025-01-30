/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { cn, getInquiryCode } from "@/lib/utils";
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
  Eye,
  MoreHorizontal,
  ScanSearch,
  ShieldBan,
  ShieldCheck,
  ShieldEllipsis,
  User,
  UserRoundSearch,
} from "lucide-react";
import { DialogInquiry } from "../dialog_inquiry";
import { BadgeResultInquiry } from "../badge_result_inquiry";
import { DialogSetInvestigator } from "../dialog_set_investigator";
import { IUserProfile } from "@/utils/types/user.type";
import { Session } from "@auth/core/types";
import { DialogAdminApproval } from "../dialog_admin_approval";
import { DialogInvestigatorFinally } from "../dialog_investigator_finally";

type ColumnsProps = {
  session: Session | null;
};

export const columns = ({ session }: ColumnsProps): ColumnDef<IInquiry>[] => [
  {
    accessorKey: "code",
    header: "Código",
    meta: {
      headerClassName: "w-20 text-xs",
    },
    cell: ({ row: { original: inquiry } }) => {
      return (
        <div className="w-20 max-w-20 text-xs text-center">
          #
          <span className="">
            {getInquiryCode({
              requestDate: inquiry.requestDate,
              code: inquiry.code,
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "requestDate",
    header: "Data da Solicitação",
    meta: {
      headerClassName: "w-20 text-xs text-center",
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
      headerClassName: "w-40 text-xs text-center",
    },
    cell: ({ row: { original: inquiry } }) => {
      if (!inquiry.investigator) return null;

      return (
        <div className="flex items-center justify-center  text-xs gap-2 w-full max-w-40 bg-muted rounded-full px-4 py-1 ">
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
        inquiry: inquiry,
        userProfile: session?.user.profile,
      });
    },
  },

  {
    id: "actions",
    meta: {
      headerClassName: "w-20 text-xs",
    },
    cell: ({ row: { original: inquiry } }) => {
      return (
        <div className="flex items-center gap-4 justify-center">
          {/* {!inquiry.investigatorId && !inquiry.result && (
          )} */}
          <DialogInquiry
            trigger={
              <button className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    {session?.user.profile === IUserProfile.INVESTIGATOR &&
                    !inquiry.result ? (
                      <ScanSearch size={14} />
                    ) : !inquiry.investigatorId && !inquiry.result ? (
                      <Edit2 size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">
                      {inquiry.investigatorId &&
                      session?.user.profile === IUserProfile.INVESTIGATOR &&
                      !inquiry.result
                        ? "Continuar Processo"
                        : !inquiry.result &&
                          session?.user.profile === IUserProfile.BRANCH &&
                          !inquiry.investigatorId
                        ? "Editar"
                        : "Visualizar"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </button>
            }
            dialogTitle={
              !inquiry.investigatorId && !inquiry.result
                ? "Editando Consulta"
                : "Visualizando Consulta"
            }
            editInquiry={inquiry}
          />

          {session?.user.profile === IUserProfile.INVESTIGATOR &&
            !inquiry.result && <DialogInvestigatorFinally inquiry={inquiry} />}

          {session?.user.profile === IUserProfile.ADMIN && !inquiry.result && (
            <DialogSetInvestigator editInquiry={inquiry} />
          )}

          {session?.user.profile === IUserProfile.ADMIN &&
            inquiry.result &&
            inquiry.adminApprovalDate === null && (
              <DialogAdminApproval inquiry={inquiry} />
            )}

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
