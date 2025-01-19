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

import { toast } from "@/hooks/use-toast";
import { cn, durationToast, formatCNPJ, removerFormat } from "@/lib/utils";
import { IBranch } from "@/utils/types/branch.type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ICompany } from "@/utils/types/company.type";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/lib/api";
import { createBranch, updateBranch } from "@/actions/branches";

const schema = z.object({
  fantasyName: z
    .string({ required_error: "Obrigatório." })
    .min(1, "Obrigatório."),
  socialReason: z.string({ required_error: "Obrigatório." }).optional(),
  cnpj: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  companyId: z.string({ required_error: "Obrigatório." }),
});
export type TFormBranchData = z.infer<typeof schema>;

interface IFormBranchProps {
  editBranch?: IBranch;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormBranch({ editBranch, closeModal }: IFormBranchProps) {
  const [isPending, startTransition] = useTransition();
  const [listCompanies, setListCompanies] = useState<ICompany[]>([]);

  const form = useForm<TFormBranchData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fantasyName: editBranch ? editBranch.fantasyName : "",
      socialReason: editBranch ? editBranch.socialReason : "",
      cnpj: editBranch ? formatCNPJ(editBranch.cnpj) : "",
      companyId: editBranch ? editBranch.companyId : "",
    },
  });

  async function handleSend(data: TFormBranchData) {
    startTransition(async () => {
      try {
        if (editBranch) {
          // update
          const branch = await updateBranch({
            ...data,
            id: editBranch.id,
          });
        } else {
          // create
          const branch = await createBranch(data);

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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log(
          "🚀 ~ fetchCompanies ~ config api baseUrl:",
          process.env.NEXT_PUBLIC_API_URL
        );

        const resp = await api.get("/company");
        const respData: ICompany[] = await resp.data.data;

        setListCompanies(respData);
      } catch (error) {
        console.log("🚀 ~ fetchCompanies ~ error:", error);
      }
    };

    fetchCompanies();
  }, []);

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
              name="companyId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Empresa</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                            {
                              "text-destructive":
                                form.formState.errors.companyId,
                            }
                          )}
                        >
                          {field.value
                            ? listCompanies.find(
                                (company) => company.id === field.value
                              )?.name
                            : "Selecionar..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0 z-[99]">
                      <Command>
                        <CommandInput
                          placeholder="Buscar empresa..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            Nenhuma empresa encontrada.
                          </CommandEmpty>
                          <CommandGroup>
                            {listCompanies.map((company) => (
                              <CommandItem
                                value={company.name}
                                key={company.id}
                                onSelect={() => {
                                  form.setValue("companyId", company.id);
                                }}
                              >
                                {company.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    company.id === field.value
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
                  {/* <FormMessage className="mt-1 px-2 text-xs" /> */}
                </FormItem>
              )}
            />

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
                      onChange={(e) => {
                        field.onChange(formatCNPJ(e.target.value));
                      }}
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
