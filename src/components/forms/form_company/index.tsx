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
import { createCompany } from "@/actions/companies";
import { toast } from "@/hooks/use-toast";
import { durationToast } from "@/lib/utils";

const schema = z.object({
  name: z.string({ required_error: "Obrigatório." }),
});
export type TFormCompanyData = z.infer<typeof schema>;

interface IFormCompanyProps {
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormCompany({ closeModal }: IFormCompanyProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TFormCompanyData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  async function handleSubmit(data: TFormCompanyData) {
    startTransition(async () => {
      try {
        const company = await createCompany(data);

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              Empresa cadastrada com sucesso.
            </p>
          ),
          duration: durationToast,
        });

        form.reset();

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
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex h-full flex-col pb-4"
        >
          <div className="flex flex-grow flex-col justify-center gap-2 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Nome da Empresa</FormLabel>
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
