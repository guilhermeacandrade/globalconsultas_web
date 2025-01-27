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
import { IInquiry } from "@/utils/types/inquiry.type";
import React, { useState } from "react";

interface DialogUserProps {
  editInquiry?: IInquiry;
  trigger: React.ReactNode;
  dialogTitle?: string;
}

export function DialogInquiry({
  trigger,
  dialogTitle,
  editInquiry,
}: DialogUserProps) {
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
          {/* <FormInquiry closeModal={setDialogIsOpen} editInquiry={editInquiry} /> */}
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
