/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

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
import { IInquiry } from "@/utils/types/inquiry.type";
import { IUser } from "@/utils/types/user.type";
import { UserRoundSearch } from "lucide-react";
import React, { useState } from "react";
import { FormSetInvestigator } from "./form_set_investigator";

interface DialogSetInvestigatorProps {
  editInquiry: IInquiry;
}

export function DialogSetInvestigator({
  editInquiry,
}: DialogSetInvestigatorProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

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
              <UserRoundSearch size={14} />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Enviar p/ Consultor</p>
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
          <DialogTitle>Enviar consulta pra Consultor</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto mt-4">
          <FormSetInvestigator editInquiry={editInquiry} />
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
