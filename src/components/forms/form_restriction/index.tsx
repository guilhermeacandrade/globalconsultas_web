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
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  Check,
  CheckCheck,
  ChevronsUpDown,
  CircleX,
  LoaderCircle,
} from "lucide-react";
import {
  IRestriction,
  IRestrictionTypes,
  RESTRICTION_TYPES_OPTIONS,
} from "@/utils/types/restriction.type";
import { toast } from "@/hooks/use-toast";
import { cn, durationToast } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/lib/api";
import { createRestriction, updateRestriction } from "@/actions/restrictions";
import { Textarea } from "@/components/ui/textarea";

const createSchema = (edit: boolean) =>
  z.object({
    type: z.enum(Object.values(IRestrictionTypes) as [IRestrictionTypes], {
      required_error: "Obrigatório.",
    }),
    article: z.string().trim().optional(),
    description: z.string().trim().optional(),
  });

// export type TFormRestrictionData = z.infer<typeof schema>;
export type TFormRestrictionData = z.infer<ReturnType<typeof createSchema>>;

interface IFormRestrictionProps {
  editRestriction?: IRestriction;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormRestriction({
  closeModal,
  editRestriction,
}: IFormRestrictionProps) {
  const [isPending, startTransition] = useTransition();

  const schema = createSchema(!!editRestriction);
  const form = useForm<TFormRestrictionData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: editRestriction?.type || undefined,
      article: editRestriction?.article || "",
      description: editRestriction?.description || "",
    },
  });

  async function onSubmit(data: TFormRestrictionData) {
    startTransition(async () => {
      try {
        console.log("🚀 ~ onSubmit ~ data:", data);

        if (editRestriction) {
          // update
          const restriction = await updateRestriction({
            ...data,
            id: editRestriction.id,
          });
        } else {
          // create
          const restriction = await createRestriction(data);
          form.reset();
        }

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              {editRestriction
                ? "Restrição editada com sucesso."
                : "Restrição cadastrada com sucesso."}
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col pb-4 px-1"
        >
          <div className="flex flex-grow flex-col justify-center gap-2 ">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Tipo de Restrição</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          // disabled={data?.Restriction.profile === "Restriction"}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? RESTRICTION_TYPES_OPTIONS.find(
                                (type) => type.value === field.value
                              )?.label
                            : "Selecione um tipo de restrição"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Procurar tipo de restrição..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Nenhum tipo de restrição.</CommandEmpty>
                          <CommandGroup>
                            {RESTRICTION_TYPES_OPTIONS.map((type) => (
                              <CommandItem
                                value={type.label}
                                key={type.value}
                                onSelect={() => {
                                  form.setValue("type", type.value);
                                }}
                              >
                                {type.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    type.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="mt-1 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="article"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Artigo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      className="focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="focus-visible:ring-primary min-h-28"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
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
