/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { FormBranch } from "@/components/forms/form_branch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IBranch } from "@/utils/types/branch.type";

import React, { useState } from "react";

interface DialogBranchProps {
  editBranch?: IBranch;
  trigger: React.ReactNode;
  dialogTitle?: string;
}

export function DialogBranch({
  trigger,
  dialogTitle,
  editBranch,
}: DialogBranchProps) {
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
        className="my-auto flex max-h-[calc(100svh-48px)] flex-col z-50"
        onInteractOutside={(e) => e.preventDefault()} // Não fechar o dialog ao clicar fora dele
        onEscapeKeyDown={(e) => e.preventDefault()} // Não fechar o dialog ao apertar a tecla ESC
      >
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        {/* <ScrollArea className="flex-1 overflow-auto"> */}
        <FormBranch closeModal={setDialogIsOpen} editBranch={editBranch} />
        {/* <ScrollBar /> */}
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  );
}
