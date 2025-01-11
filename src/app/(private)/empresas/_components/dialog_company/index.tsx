/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { FormCompany } from "@/components/forms/form_company";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export function DialogCompany() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <Dialog
      open={dialogIsOpen}
      onOpenChange={(isOpen) => {
        setDialogIsOpen(isOpen);
      }}
    >
      <DialogTrigger className="flex items-center gap-1 bg-primary text-background py-2 px-3 rounded-lg text-sm hover:bg-primary/90">
        <PlusCircle size={20} />
        Cadastrar Nova
      </DialogTrigger>

      <DialogContent

      // className="my-auto flex max-h-[calc(100svh-48px)] flex-col"
      // onInteractOutside={(e) => e.preventDefault()} // Não fechar o dialog ao clicar fora dele
      // onEscapeKeyDown={(e) => e.preventDefault()} // Não fechar o dialog ao apertar a tecla ESC
      >
        <DialogHeader>
          <DialogTitle>Nova Empresa</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto mt-4">
          <FormCompany closeModal={setDialogIsOpen} />
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
