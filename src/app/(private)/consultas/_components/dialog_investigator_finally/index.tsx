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
import { IInquiry, IResultInquiries } from "@/utils/types/inquiry.type";
import { CheckCheck, CircleX, LoaderCircle, Stamp } from "lucide-react";
import React, { useState, useTransition } from "react";
import { BadgeResultInquiry } from "../badge_result_inquiry";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { updateInvestigatorFinally } from "@/actions/inquiries/update_investigator_finally";

interface DialogInvestigatorFinallyProps {
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

export function DialogInvestigatorFinally({
  inquiry,
}: DialogInvestigatorFinallyProps) {
  const { data: session } = useSession();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleFinally({
    inquiryId,
    result,
  }: {
    inquiryId: string;
    result: IResultInquiries;
  }) {
    startTransition(async () => {
      try {
        // update
        const res = await updateInvestigatorFinally({ id: inquiryId, result });

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
        <button className="flex items-center gap-2 rounded-full p-2 hover:bg-primary hover:text-background duration-1000">
          <Tooltip>
            <TooltipTrigger asChild>
              <Stamp size={14} />
            </TooltipTrigger>
            <TooltipContent side="top" className="mb-2">
              <p className="text-xs">Finalizar Consulta</p>
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
          <DialogTitle>Finalizar Consulta</DialogTitle>
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
                inquiry={inquiry}
                className="max-w-full my-5"
              />
            </div>

            <div className="grid grid-cols-2 mt-10">
              {/* <Button
                className="w-full max-w-32 mx-auto bg-muted hover:bg-muted/90 text-muted-foreground"
                onClick={() => setDialogIsOpen(false)}
              >
                Voltar
              </Button> */}
              <Button
                className="w-full max-w-32 mx-auto"
                variant={"destructive"}
                disabled={isPending}
                onClick={() =>
                  handleFinally({
                    inquiryId: inquiry.id,
                    result: IResultInquiries.REJECTED,
                  })
                }
              >
                {isPending ? (
                  <LoaderCircle size={24} className="animate-spin" />
                ) : (
                  "Reprovar"
                )}
              </Button>
              <Button
                className="w-full max-w-32 mx-auto"
                disabled={isPending}
                onClick={() =>
                  handleFinally({
                    inquiryId: inquiry.id,
                    result: IResultInquiries.APPROVED,
                  })
                }
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
