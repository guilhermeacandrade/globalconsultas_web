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
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  cn,
  durationToast,
  formatCPF,
  formatDate,
  formatRG,
} from "@/lib/utils";
import { IInquiry, IInquiryRestriction } from "@/utils/types/inquiry.type";
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
import {
  IRestriction,
  IRestrictionTypes,
  RESTRICTION_TYPES_LABELS,
} from "@/utils/types/restriction.type";
import {
  createInquiryRestriction,
  updateInquiryRestriction,
} from "@/actions/inquiryRestrictions";
import { deleteInquiryRestriction } from "@/actions/inquiryRestrictions/delete_inquiry_restriction";
import { useInquiries } from "@/hooks/use_inquiries";

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

const schemaRestriction = z.object({
  restrictionId: z.string({ required_error: "Obrigatório" }),
  justification: z
    .string({ required_error: "Obrigatório." })
    .min(1, "Obrigatório."),
});
export type TFormInquiryRestrictionData = z.infer<typeof schemaRestriction>;

interface IFormInquiryProps {
  editInquiry?: IInquiry;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

interface DataRestrictionProps {
  showFields: boolean;
  editRestriction: IInquiryRestriction | null;
}

export function FormInquiry({ editInquiry, closeModal }: IFormInquiryProps) {
  const { data: session } = useSession();
  const { mutate } = useInquiries();
  const [isPending, startTransition] = useTransition();
  const [listBranches, setListBranches] = useState<IBranch[] | []>([]);
  const [dataRestriction, setDataRestriction] = useState<DataRestrictionProps>({
    showFields: false,
    editRestriction: null,
  });
  const [listRestrictions, setListRestriction] = useState<IRestriction[] | []>(
    []
  );
  const [currInquiryRestrictions, setCurrInquiryRestrictions] = useState<
    IInquiryRestriction[] | []
  >([]);

  const disbleField: boolean = !editInquiry
    ? false
    : !!editInquiry.result || !!editInquiry.investigatorId;

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

  const formRestriction = useForm<TFormInquiryRestrictionData>({
    resolver: zodResolver(schemaRestriction),
    defaultValues: {
      restrictionId: dataRestriction.editRestriction?.restrictionId || "",
      justification: dataRestriction.editRestriction?.justification || "",
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

        mutate();

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

  async function handleSendRestriction(data: TFormInquiryRestrictionData) {
    startTransition(async () => {
      try {
        if (dataRestriction.editRestriction) {
          // update
          const inquiryRestriction = await updateInquiryRestriction({
            ...data,
            id: dataRestriction.editRestriction.id,
          });

          updateCurrInquiryRestrictions(inquiryRestriction, "update");
        } else {
          // create
          const inquiryRestriction = await createInquiryRestriction({
            ...data,
            inquiryId: editInquiry?.id as string,
          });

          updateCurrInquiryRestrictions(inquiryRestriction, "new");
        }

        formRestriction.reset();

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              Restrição lançada com sucesso.
            </p>
          ),
          duration: durationToast,
        });

        setDataRestriction({ showFields: false, editRestriction: null });
      } catch (err: any) {
        console.log(err);

        formRestriction.setError("root", {
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

  async function handleDeleteRestriction(data: IInquiryRestriction) {
    startTransition(async () => {
      try {
        await deleteInquiryRestriction({ id: data.id });

        updateCurrInquiryRestrictions(data, "delete");

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              Restrição removida com sucesso.
            </p>
          ),
          duration: durationToast,
        });
      } catch (err: any) {
        console.log(err);

        formRestriction.setError("root", {
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

  function updateCurrInquiryRestrictions(
    inquiryRestriction: IInquiryRestriction,
    oper: "new" | "update" | "delete"
  ) {
    if (oper === "new") {
      setCurrInquiryRestrictions([
        ...currInquiryRestrictions,
        inquiryRestriction,
      ]);
    }

    if (oper === "update") {
      const newList = currInquiryRestrictions.map((item) =>
        item.id === inquiryRestriction.id ? inquiryRestriction : item
      );

      setCurrInquiryRestrictions(newList);
    }

    if (oper === "delete") {
      const newList = currInquiryRestrictions.filter(
        (item) => item.id !== inquiryRestriction.id
      );

      setCurrInquiryRestrictions(newList);
    }
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
          const respData: IBranch[] = [await resp.data.data];
          console.log("🚀 ~ fetchBranches ~ /branch/id ~ respData:", respData);

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

    const fetchRestriction = async () => {
      const resp = await api.get("/restriction");
      const records: IRestriction[] = resp.data.data;

      setListRestriction(records);
    };

    fetchBranches();
    fetchRestriction();

    if (editInquiry) {
      setCurrInquiryRestrictions(editInquiry.inquieriesRestrictions);
    }
  }, []);

  return (
    <div className="px-1">
      <Tabs defaultValue="data-business">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger
            value="data-inquiry"
            className={cn({
              "col-span-2": session?.user.profile === IUserProfile.BRANCH,
            })}
          >
            Dados do Candidato
          </TabsTrigger>
          <TabsTrigger
            value="data-restrictions"
            className={cn({
              hidden: session?.user.profile === IUserProfile.BRANCH,
            })}
          >
            Restrições
          </TabsTrigger>
        </TabsList>

        {editInquiry &&
          BadgeResultInquiry({
            inquiry: editInquiry,
            userProfile: session?.user.profile,
            className: "max-w-full mt-5",
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

                {!disbleField ? (
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
                ) : (
                  <Button
                    className="mt-10 w-full max-w-32 mx-auto bg-muted hover:bg-muted/90 text-muted-foreground"
                    onClick={(e) => {
                      e.preventDefault();

                      if (closeModal) closeModal(false);
                    }}
                  >
                    Fechar
                  </Button>
                )}
              </form>
            </Form>
            <ScrollBar />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="data-restrictions" className="flex flex-col">
          <ScrollArea className="flex-grow overflow-auto mt-4 ">
            {dataRestriction.showFields ? (
              <div>
                <Form {...formRestriction}>
                  <form
                    onSubmit={formRestriction.handleSubmit(
                      handleSendRestriction
                    )}
                    className="flex-grow flex h-full flex-col justify-between px-1"
                  >
                    <div className="flex flex-col gap-2 ">
                      <FormField
                        control={formRestriction.control}
                        name="restrictionId"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="font-semibold">
                              Restrição
                            </FormLabel>
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
                                          formRestriction.formState.errors
                                            .restrictionId,
                                      }
                                    )}
                                  >
                                    {field.value
                                      ? `${
                                          RESTRICTION_TYPES_LABELS[
                                            listRestrictions.find(
                                              (restriction) =>
                                                restriction.id === field.value
                                            )?.type as IRestrictionTypes
                                          ]
                                        } - ${
                                          listRestrictions.find(
                                            (restriction) =>
                                              restriction.id === field.value
                                          )?.article
                                        }`
                                      : "Selecionar..."}
                                    <ChevronsUpDown className="opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>

                              <PopoverContent className="p-0 z-[99]">
                                <Command>
                                  <CommandInput
                                    placeholder="Buscar restrição..."
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      Nenhuma restrição encontrada.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {listRestrictions.map((restriction) => (
                                        <CommandItem
                                          value={restriction.type}
                                          key={restriction.id}
                                          onSelect={() => {
                                            formRestriction.setValue(
                                              "restrictionId",
                                              restriction.id
                                            );
                                          }}
                                        >
                                          {`${
                                            RESTRICTION_TYPES_LABELS[
                                              restriction.type
                                            ]
                                          } - ${restriction.article}`}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              restriction.id === field.value
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
                        control={formRestriction.control}
                        name="justification"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Justificativa</FormLabel>
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

                      {formRestriction.formState.errors.root && (
                        <p className="mt-1 text-center text-xs text-destructive">
                          {formRestriction.formState.errors.root.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 mt-10">
                      <Button
                        className="w-full max-w-32 mx-auto bg-muted hover:bg-muted/90 text-muted-foreground"
                        onClick={() => {
                          formRestriction.reset();
                          setDataRestriction({
                            showFields: false,
                            editRestriction: null,
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="w-full max-w-32 mx-auto"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <LoaderCircle size={24} className="animate-spin" />
                        ) : (
                          "Salvar"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="flex flex-col ">
                {currInquiryRestrictions.length === 0 && (
                  <div className="py-5">
                    <p className="text-sm text-center text-zinc-500">
                      {editInquiry && editInquiry.result
                        ? "Nenhuma restrição encontrada."
                        : "Nenhuma restrição lançada."}
                    </p>
                  </div>
                )}

                {currInquiryRestrictions.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {currInquiryRestrictions.map((restriction) => {
                      return (
                        <div
                          key={restriction.id}
                          className="flex items-center justify-between shadow-md border border-border rounded-lg p-2"
                        >
                          <div className="flex flex-col flex-grow">
                            <span className="bg-muted px-3 py-1 rounded-full max-w-fit text-sm">
                              {
                                RESTRICTION_TYPES_LABELS[
                                  restriction.restriction.type
                                ]
                              }
                            </span>
                            <span className="px-3">
                              {restriction.justification}
                            </span>
                          </div>

                          <div
                            className={cn("flex gap-2 px-2", {
                              hidden:
                                session?.user.profile !==
                                  IUserProfile.INVESTIGATOR ||
                                editInquiry?.result,
                            })}
                          >
                            <button
                              className="hover:text-primary duration-200"
                              onClick={() => {
                                formRestriction.setValue(
                                  "restrictionId",
                                  restriction.restrictionId
                                );
                                formRestriction.setValue(
                                  "justification",
                                  restriction.justification
                                );

                                setDataRestriction({
                                  showFields: true,
                                  editRestriction: restriction,
                                });
                              }}
                            >
                              <Edit2 size={20} />
                            </button>

                            <button
                              className="hover:text-destructive duration-200"
                              onClick={() =>
                                handleDeleteRestriction(restriction)
                              }
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {session?.user.profile === IUserProfile.INVESTIGATOR &&
                  !editInquiry?.result && (
                    <Button
                      className="self-center mt-10"
                      onClick={() =>
                        setDataRestriction({
                          showFields: true,
                          editRestriction: null,
                        })
                      }
                    >
                      Lançar Restrição
                    </Button>
                  )}
              </div>
            )}
            <ScrollBar />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
