/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { FormCompany } from "@/components/forms/form_company";
import { FormUser } from "@/components/forms/form_user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IUser } from "@/utils/types/user.type";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";

interface DialogUserProps {
  editUser?: IUser;
  trigger: React.ReactNode;
  dialogTitle?: string;
}

export function DialogUser({
  trigger,
  dialogTitle,
  editUser,
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
          <FormUser closeModal={setDialogIsOpen} editUser={editUser} />
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
