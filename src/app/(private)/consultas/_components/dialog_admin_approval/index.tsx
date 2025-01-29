/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  cn,
  durationToast,
  formatCPF,
  formatDate,
  formatRG,
  getInquiryCode,
} from "@/lib/utils";
import { IInquiry } from "@/utils/types/inquiry.type";
import { CheckCheck, CircleX, LoaderCircle, SearchCheck } from "lucide-react";
import React, { useState, useTransition } from "react";
import { BadgeResultInquiry } from "../badge_result_inquiry";
import { useSession } from "next-auth/react";
import { updateAdminApproval } from "@/actions/inquiries/update_admin_approval";
import { toast } from "@/hooks/use-toast";

interface DialogAdminApprovalProps {
  inquiry: IInquiry;
}

const FieldMessage = (data: {
  title: string;
  description: string;
  classNameTitle?: string;
  classNameDescription?: string;
}) => {
  return (
    <div className="flex flex-col">
      <span className={cn("font-semibold", data.classNameTitle)}>
        {data.title}
      </span>
      <span className={cn("", data.classNameDescription)}>
        {data.description}
      </span>
    </div>
  );
};

export function DialogAdminApproval({ inquiry }: DialogAdminApprovalProps) {
  const { data: session } = useSession();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      try {
        // update
        const res = await updateAdminApproval({ id: inquiry.id });

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              Consulta aprovada com sucesso.
            </p>
          ),
          duration: durationToast,
        });

        setDialogIsOpen(false);
      } catch (err: any) {
        console.log(err);

        toast({
          title: "Erro!",
          description: (
            <p className="flex items-center gap-3">
              <CircleX className="text-red-500" />
              {err.message}
            </p>
          ),
          duration: durationToast,
        });
      }
    });
  }

  return (
    <Dialog
      open={dialogIsOpen}
      onOpenChange={(isOpen) => {
        setDialogIsOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <button className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <SearchCheck size={14} />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Aprovar Consulta</p>
            </TooltipContent>
          </Tooltip>
        </button>
      </DialogTrigger>

      <DialogContent
        className="my-auto flex max-h-[calc(100svh-48px)] flex-col"
        onInteractOutside={(e) => e.preventDefault()} // Não fechar o dialog ao clicar fora dele
        onEscapeKeyDown={(e) => e.preventDefault()} // Não fechar o dialog ao apertar a tecla ESC
      >
        <DialogHeader>
          <DialogTitle>Deseja realmente aprovar esta consulta?</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto mt-4">
          <div>
            <div className="text-xs space-y-2">
              <div className="flex items-center gap-3">
                <FieldMessage
                  title="Código"
                  description={
                    "#" +
                    getInquiryCode({
                      requestDate: inquiry.requestDate,
                      code: inquiry.code,
                    })
                  }
                />
                <FieldMessage
                  title="Filial"
                  description={inquiry.person.branch.fantasyName}
                />
              </div>

              <div className="space-y-2">
                <FieldMessage
                  title="Candidato:"
                  description={inquiry.person.name}
                />
                <div className="flex items-center gap-4">
                  <FieldMessage
                    title="CPF"
                    description={formatCPF(inquiry.person.cpf)}
                  />
                  <FieldMessage
                    title="RG"
                    description={formatRG(inquiry.person.rg)}
                  />
                  <FieldMessage
                    title="Data de Nascimento"
                    description={formatDate(new Date(inquiry.person.bornDate))}
                  />
                </div>
              </div>
            </div>

            <div>
              <BadgeResultInquiry
                userProfile={session?.user.profile}
                inquiryResult={inquiry.result}
                inquiryInvestigator={!!inquiry.investigatorId}
                className="max-w-full my-5"
              />
            </div>

            <div className="grid grid-cols-2 mt-10">
              <Button
                className="w-full max-w-32 mx-auto bg-muted hover:bg-muted/90 text-muted-foreground"
                onClick={() => setDialogIsOpen(false)}
              >
                Voltar
              </Button>
              <Button
                className="w-full max-w-32 mx-auto"
                disabled={isPending}
                onClick={handleApprove}
              >
                {isPending ? (
                  <LoaderCircle size={24} className="animate-spin" />
                ) : (
                  "Aprovar"
                )}
              </Button>
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
