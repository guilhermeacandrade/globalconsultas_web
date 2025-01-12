/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useTransition } from "react";
import { CheckCheck, CircleX, LoaderCircle } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { durationToast } from "@/lib/utils";
import { IBranch } from "@/utils/types/branch.type";

const schema = z.object({
  fantasyName: z
    .string({ required_error: "Obrigatório." })
    .min(1, "Obrigatório."),
  socialReason: z.string({ required_error: "Obrigatório." }).optional(),
  cnpj: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
});
export type TFormBranchData = z.infer<typeof schema>;

interface IFormBranchProps {
  editBranch?: IBranch;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormBranch({ editBranch, closeModal }: IFormBranchProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TFormBranchData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fantasyName: "",
      socialReason: "",
      cnpj: "",
    },
  });

  async function handleSend(data: TFormBranchData) {
    startTransition(async () => {
      try {
        if (editBranch) {
          // update
          // const branch = await updateCompany({
          //   ...data,
          //   id: editBranch.id,
          // });
        } else {
          // create
          // const branch = await createCompany(data);

          form.reset();
        }

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              {editBranch
                ? "Filial editada com sucesso."
                : "Filial cadastrada com sucesso."}
            </p>
          ),
          duration: durationToast,
        });

        if (closeModal) closeModal(false);
      } catch (err: any) {
        console.log(err);

        form.setError("root", {
          type: "",
          message: `Erro: ${err}`,
        });

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
    <div className="px-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSend)}
          className="flex h-full flex-col pb-4"
        >
          <div className="flex flex-grow flex-col justify-center gap-2 ">
            <FormField
              control={form.control}
              name="fantasyName"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Nome Fantasia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      className="focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs pt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialReason"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      className="focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs pt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      className="focus-visible:ring-primary"
                      maxLength={18}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs pt-1" />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="mt-1 text-center text-xs text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full max-w-32 self-center mt-10"
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle size={24} className="animate-spin" />
            ) : (
              "Salvar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
