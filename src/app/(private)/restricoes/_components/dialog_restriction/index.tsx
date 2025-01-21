/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { FormRestriction } from "@/components/forms/form_restriction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IRestriction } from "@/utils/types/restriction.type";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";

interface DialogRestrictionProps {
  editRestriction?: IRestriction;
  trigger: React.ReactNode;
  dialogTitle?: string;
}

export function DialogRestriction({
  trigger,
  dialogTitle,
  editRestriction,
}: DialogRestrictionProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <Dialog
      open={dialogIsOpen}
      onOpenChange={(isOpen) => {
        setDialogIsOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="my-auto flex max-h-[calc(100svh-48px)] flex-col"
        onInteractOutside={(e) => e.preventDefault()} // Não fechar o dialog ao clicar fora dele
        onEscapeKeyDown={(e) => e.preventDefault()} // Não fechar o dialog ao apertar a tecla ESC
      >
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto mt-4">
          <FormRestriction
            closeModal={setDialogIsOpen}
            editRestriction={editRestriction}
          />
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
