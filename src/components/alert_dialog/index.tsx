/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import { CheckCheck, CircleX } from "lucide-react";

interface AlertProps {
  description?: string | React.ReactNode;
  onClose: () => void;
}

export function SucessAlert({ description, onClose }: AlertProps) {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              Sucesso!
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center mt-5">
          {/* <AlertDialogCancel>Ok</AlertDialogCancel> */}
          <AlertDialogAction className="min-w-24" onClick={onClose}>
            Ok
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ErrorAlert({ description, onClose }: AlertProps) {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className="flex items-center gap-3">
              <CircleX className="text-red-500" />
              Erro!
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center mt-5">
          <AlertDialogCancel className="min-w-24" onClick={onClose}>
            Ok
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
