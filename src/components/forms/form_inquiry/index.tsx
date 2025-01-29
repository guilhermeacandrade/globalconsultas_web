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
  Edit2,
  LoaderCircle,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  cn,
  durationToast,
  formatCPF,
  formatDate,
  formatRG,
} from "@/lib/utils";
import {
  IInquiry,
  IResultInquiries,
  RESULT_INQUIRY_LABELS,
  RESULT_INQUIRY_OPTIONS,
} from "@/utils/types/inquiry.type";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { IBranch } from "@/utils/types/branch.type";
import { IUserProfile } from "@/utils/types/user.type";
import { Textarea } from "@/components/ui/textarea";
import { createInquiry, updateInquiry } from "@/actions/inquiries";
import { BadgeResultInquiry } from "@/app/(private)/consultas/_components/badge_result_inquiry";

const schema = z.object({
  branchId: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  name: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  rg: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  cpf: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  bornDate: z
    .string({ required_error: "Obrigatório." })
    .min(10, "Obrigatório."),
  mothersName: z
    .string({ required_error: "Obrigatório." })
    .min(1, "Obrigatório."),
  fathersName: z.string({ required_error: "Obrigatório." }).optional(),
  observation: z.string().optional(),
});
export type TFormInquiryData = z.infer<typeof schema>;

interface IFormInquiryProps {
  editInquiry?: IInquiry;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormInquiry({ editInquiry, closeModal }: IFormInquiryProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [listBranches, setListBranches] = useState<IBranch[] | []>([]);

  const disbleField: boolean = !editInquiry ? false : !!editInquiry.result;

  const form = useForm<TFormInquiryData>({
    resolver: zodResolver(schema),
    defaultValues: {
      branchId: editInquiry?.person.branchId || session?.user.branchId || "",
      name: editInquiry?.person.name || "",
      rg: editInquiry?.person.rg ? formatRG(editInquiry?.person.rg) : "",
      cpf: editInquiry?.person.cpf ? formatCPF(editInquiry?.person.cpf) : "",
      bornDate: editInquiry?.person.bornDate
        ? formatDate(new Date(editInquiry?.person.bornDate))
        : "",
      mothersName: editInquiry?.person.mothersName || "",
      fathersName: editInquiry?.person.fathersName || "",
      observation: editInquiry?.observation || "",
    },
  });

  async function handleSend(data: TFormInquiryData) {
    startTransition(async () => {
      try {
        if (editInquiry) {
          // update
          const inquiry = await updateInquiry({
            ...data,
            id: editInquiry.id,
          });
        } else {
          // create
          const inquiry = await createInquiry({
            ...data,
          });

          form.reset();
        }

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              {editInquiry
                ? "Consulta editada com sucesso."
                : "Consulta enviada com sucesso."}
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
    const fetchBranches = async () => {
      try {
        if (session?.user.profile === IUserProfile.COMPANY) {
          const resp = await api.get(
            `/branch/company/${session?.user.companyId}`
          );
          const respData: IBranch[] = await resp.data.data;
          // console.log(
          //   "🚀 ~ fetchBranches ~ /branch/company ~ respData:",
          //   respData
          // );

          setListBranches(respData);
        } else if (session?.user.profile === IUserProfile.BRANCH) {
          const resp = await api.get(`/branch/${session?.user.branchId}`);
          const respData: IBranch[] = await resp.data.data;
          // console.log("🚀 ~ fetchBranches ~ /branch/ ~ respData:", respData);

          setListBranches(respData);
        } else {
          const resp = await api.get("/branch");
          const respData: IBranch[] = await resp.data.data;

          setListBranches(respData);
        }
      } catch (error) {
        console.log("🚀 ~ fetchBranches ~ error:", error);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="px-1">
      <Tabs defaultValue="data-business">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="data-inquiry">Dados do Candidato</TabsTrigger>
          <TabsTrigger value="data-restrictions">Restrições</TabsTrigger>
        </TabsList>

        {editInquiry &&
          BadgeResultInquiry({
            inquiryResult: editInquiry.result,
            inquiryInvestigator: !!editInquiry.investigatorId,
            className: "max-w-full my-5",
          })}

        <TabsContent
          value="data-inquiry"
          forceMount
          className="hidden data-[state=active]:block"
        >
          <ScrollArea className="flex-1 overflow-auto mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSend)}
                className="flex h-full flex-col pb-4 px-1"
              >
                <div className="flex flex-grow flex-col justify-center gap-2 ">
                  <FormField
                    control={form.control}
                    name="branchId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold">Filial</FormLabel>
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
                                      form.formState.errors.branchId,
                                  }
                                )}
                                disabled={disbleField}
                              >
                                {field.value
                                  ? listBranches.find(
                                      (branch) => branch.id === field.value
                                    )?.fantasyName
                                  : "Selecionar..."}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="p-0 z-[99]">
                            <Command>
                              <CommandInput
                                placeholder="Buscar filial..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Nenhuma filial encontrada.
                                </CommandEmpty>
                                <CommandGroup>
                                  {listBranches.map((branch) => (
                                    <CommandItem
                                      value={branch.fantasyName}
                                      key={branch.id}
                                      onSelect={() => {
                                        form.setValue("branchId", branch.id);
                                      }}
                                    >
                                      {branch.fantasyName}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          branch.id === field.value
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
                        <FormMessage className="mt-1 px-2 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Nome do Candidato</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            className="focus-visible:ring-primary"
                            disabled={disbleField}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs pt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              className="focus-visible:ring-primary"
                              maxLength={14}
                              disabled={disbleField}
                              {...field}
                              onChange={(e) => {
                                field.onChange(formatCPF(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-xs pt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rg"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel>RG</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              className="focus-visible:ring-primary"
                              maxLength={12}
                              disabled={disbleField}
                              {...field}
                              onChange={(e) => {
                                field.onChange(formatRG(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-xs pt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bornDate"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              className="focus-visible:ring-primary"
                              maxLength={10}
                              disabled={disbleField}
                              {...field}
                              onChange={(e) => {
                                field.onChange(formatDate(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-xs pt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mothersName"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Noma da Mãe</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            className="focus-visible:ring-primary"
                            disabled={disbleField}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs pt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fathersName"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Noma da Pai</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            className="focus-visible:ring-primary"
                            disabled={disbleField}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs pt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Observação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder=""
                            className="focus-visible:ring-primary min-h-28"
                            disabled={disbleField}
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
            <ScrollBar />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="data-contacts" className="flex flex-col">
          <ScrollArea className="flex-grow overflow-auto mt-4 ">
            <div>
              <h1>Segundo espaço...</h1>
            </div>
            <ScrollBar />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
