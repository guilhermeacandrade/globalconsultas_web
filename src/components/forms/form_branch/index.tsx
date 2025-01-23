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
  formatCNPJ,
  formatPhoneNumber,
  removeFormat,
} from "@/lib/utils";
import {
  IBranch,
  IContacts,
  CONTACTS_TYPES_LABELS,
  CONTACTS_TYPES_OPTIONS,
  IContactsTypes,
} from "@/utils/types/branch.type";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { createBranch, updateBranch } from "@/actions/branches";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const schema = z.object({
  code: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  fantasyName: z
    .string({ required_error: "Obrigatório." })
    .min(1, "Obrigatório."),
  socialReason: z.string({ required_error: "Obrigatório." }).optional(),
  cnpj: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  city: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  uf: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  responsibleName: z
    .string({ required_error: "Obrigatório." })
    .min(1, "Obrigatório."),
  companyId: z
    .string({ required_error: "Obrigatório." })
    .refine((value) => value !== "", { message: "Obrigatório." }),
});
export type TFormBranchData = z.infer<typeof schema>;

interface IFormBranchProps {
  editBranch?: IBranch;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

const schemaContacts = z.object({
  type: z.enum(Object.values(IContactsTypes) as [IContactsTypes], {
    required_error: "Obrigatório.",
  }),
  contact: z.string({ required_error: "Obrigatório." }).min(1, "Obrigatório."),
  responsibleName: z.string({ required_error: "Obrigatório." }).optional(),
});
export type TFormContactsData = z.infer<typeof schemaContacts>;

type TContactsList = IContacts[] | [];

export function FormBranch({ editBranch, closeModal }: IFormBranchProps) {
  const [isPending, startTransition] = useTransition();
  const [listCompanies, setListCompanies] = useState<ICompany[]>([]);
  const [focusContact, setFocusContact] = useState(false);
  const [isEditContact, setIsEditContact] = useState(false);
  const [editContact, setEditContact] = useState<IContacts | null>(null);
  const [contactsList, setContactsList] = useState<IContacts[] | []>([]);

  const form = useForm<TFormBranchData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: editBranch?.code || "",
      fantasyName: editBranch?.fantasyName || "",
      socialReason: editBranch?.socialReason || "",
      cnpj: editBranch ? formatCNPJ(editBranch.cnpj) : "",
      city: editBranch?.city || "",
      uf: editBranch?.uf || "",
      responsibleName: editBranch?.responsibleName || "",
      companyId: editBranch?.companyId || "",
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
            contacts: contactsList,
          });
        } else {
          // create
          const branch = await createBranch({
            ...data,
            contacts: contactsList,
          });

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

  const formContact = useForm<TFormContactsData>({
    resolver: zodResolver(schemaContacts),
    defaultValues: {
      type: undefined,
      contact: "",
      responsibleName: "",
    },
  });

  const typeValue = formContact.watch("type");

  async function handleSendContacts(data: TFormContactsData) {
    startTransition(async () => {
      try {
        if (editContact) {
          // update
          const newContactsList = setNewContactList(contactsList, {
            ...data,
            id: editContact?.id as string,
            deleted: false,
          });
          setContactsList(newContactsList);
        } else {
          // create
          // const branch = await createBranch(data);

          setContactsList([
            ...contactsList,
            {
              id: "new" + String(contactsList.length + 1),
              type: data.type,
              contact: data.contact,
              responsibleName: data.responsibleName,
              deleted: false,
            },
          ]);
        }

        // toast({
        //   title: "Sucesso!",
        //   description: (
        //     <p className="flex items-center gap-3">
        //       <CheckCheck className="text-green-500" />
        //       {editContact
        //         ? "Contato editado com sucesso."
        //         : "Contato cadastrado com sucesso."}
        //     </p>
        //   ),
        //   duration: durationToast,
        // });

        formContact.reset();
        setEditContact(null);
        setIsEditContact(false);

        // if (closeModal) closeModal(false);
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

  function handleEdit(data: IContacts) {
    console.log("🚀 ~ handleEdit ~ data:", data);

    formContact.setValue("type", data.type);
    formContact.setValue("contact", data.contact);
    formContact.setValue("responsibleName", data.responsibleName);

    setEditContact(data);
    setIsEditContact(true);
  }

  function handleDeleteContacts(data: IContacts) {
    const newContactsList = setNewContactList(contactsList, {
      ...data,
      deleted: true,
    });
    setContactsList(newContactsList);
  }

  function setNewContactList(
    currContactsList: TContactsList,
    itemEdit: IContacts
  ): TContactsList {
    return currContactsList.map((item) =>
      item.id === itemEdit.id ? itemEdit : item
    );
  }

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const resp = await api.get("/company");
        const respData: ICompany[] = await resp.data.data;

        setListCompanies(respData);
      } catch (error) {
        console.log("🚀 ~ fetchCompanies ~ error:", error);
      }
    };

    if (editBranch) {
      setContactsList(editBranch.contacts);
    }

    fetchCompanies();
  }, []);

  return (
    <div className="px-1">
      <Tabs defaultValue="data-business">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="data-business">Dados Empresariais</TabsTrigger>
          <TabsTrigger value="data-contacts">Contatos</TabsTrigger>
        </TabsList>

        <TabsContent
          value="data-business"
          forceMount
          className="hidden data-[state=active]:block"
        >
          <ScrollArea className="flex-1 overflow-auto mt-4">
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
                        <FormMessage className="mt-1 px-2 text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem className="space-y-0 max-w-24">
                          <FormLabel>Código</FormLabel>
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
                      name="fantasyName"
                      render={({ field }) => (
                        <FormItem className="space-y-0 w-full">
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
                  </div>

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

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Cidade</FormLabel>
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
                      name="uf"
                      render={({ field }) => (
                        <FormItem className="max-w-12">
                          <FormLabel>UF</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              className="uppercase focus-visible:ring-primary"
                              maxLength={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs pt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="responsibleName"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Responsável pela Unidade</FormLabel>
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
            <ScrollBar />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="data-contacts" className="flex flex-col">
          <ScrollArea className="flex-grow overflow-auto mt-4 ">
            {isEditContact ? (
              <Form {...formContact}>
                <form
                  onSubmit={formContact.handleSubmit(handleSendContacts)}
                  className="flex-grow flex h-full flex-col justify-between"
                >
                  <div className="flex flex-col gap-2 ">
                    <div>
                      <FormLabel
                        className={cn({
                          "text-destructive":
                            formContact.formState.errors.contact ||
                            formContact.formState.errors.type,
                        })}
                      >
                        Contato
                      </FormLabel>

                      <div
                        className={cn(
                          "flex items-center w-full rounded-md border border-input bg-transparent px-3 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          { "outline-none ring-1 ring-primary": focusContact }
                        )}
                      >
                        <FormField
                          control={formContact.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem className="">
                              {/* <FormLabel>Contato</FormLabel> */}
                              <Popover modal>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "w-30 gap-2",
                                        !field.value && "text-muted-foreground",
                                        "border-none shadow-none bg-muted rounded-full text-xs h-fit py-1 px-3"
                                      )}
                                      // onFocus={() => setFocusContact(true)}
                                      // onBlur={() => setFocusContact(false)}
                                    >
                                      {field.value
                                        ? CONTACTS_TYPES_OPTIONS.find(
                                            (profile) =>
                                              profile.value === field.value
                                          )?.label
                                        : "Selecionar"}
                                      <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>

                                <PopoverContent
                                  align="start"
                                  className="p-0 w-36"
                                >
                                  <Command>
                                    <CommandList>
                                      <CommandEmpty>Nenhum tipo.</CommandEmpty>
                                      <CommandGroup>
                                        {CONTACTS_TYPES_OPTIONS.map((type) => (
                                          <CommandItem
                                            value={type.label}
                                            key={type.value}
                                            onSelect={() => {
                                              formContact.setValue(
                                                "type",
                                                type.value
                                              );
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
                              {/* <FormMessage className="mt-1 text-xs" /> */}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formContact.control}
                          name="contact"
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              {/* <FormLabel>Contato</FormLabel> */}
                              <FormControl>
                                <Input
                                  placeholder=""
                                  className="focus-visible:ring-0 border-none shadow-none"
                                  maxLength={
                                    typeValue === IContactsTypes.NUMBER_FIXED ||
                                    typeValue === IContactsTypes.NUMBER_MOBILE
                                      ? 15
                                      : undefined
                                  }
                                  {...field}
                                  onChange={(e) => {
                                    if (
                                      typeValue ===
                                        IContactsTypes.NUMBER_FIXED ||
                                      typeValue === IContactsTypes.NUMBER_MOBILE
                                    ) {
                                      field.onChange(
                                        formatPhoneNumber(e.target.value)
                                      );
                                    } else {
                                      field.onChange(e.target.value);
                                    }
                                  }}
                                  onFocus={() => setFocusContact(true)}
                                  onBlur={() => setFocusContact(false)}
                                />
                              </FormControl>
                              {/* <FormMessage className="text-xs pt-1" /> */}
                            </FormItem>
                          )}
                        />
                      </div>

                      {(formContact.formState.errors.contact ||
                        formContact.formState.errors.type) && (
                        <p
                          className={cn(
                            "text-[0.8rem] font-medium text-destructive",
                            "text-xs pt-1"
                          )}
                        >
                          {formContact.formState.errors.contact?.message ||
                            formContact.formState.errors.type?.message}
                        </p>
                      )}
                    </div>

                    <FormField
                      control={formContact.control}
                      name="responsibleName"
                      render={({ field }) => (
                        <FormItem className="space-y-0 w-full">
                          <FormLabel>
                            Nome do Responsável pelo Contato
                          </FormLabel>
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

                    {formContact.formState.errors.root && (
                      <p className="mt-1 text-center text-xs text-destructive">
                        {formContact.formState.errors.root.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 mt-10">
                    <Button
                      className="w-full max-w-32 mx-auto bg-muted hover:bg-muted/90 text-muted-foreground"
                      onClick={() => {
                        formContact.reset();
                        setIsEditContact(false);
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
            ) : (
              <div className="min-h-80 flex flex-col justify-between ">
                <ScrollArea className="max-h-96 overflow-auto ">
                  <div className="flex flex-col gap-1 py-2">
                    {contactsList.filter((item) => !item.deleted).length > 0 ? (
                      contactsList.map((v, i) => {
                        if (v.deleted) return null;

                        return (
                          <div
                            key={i}
                            className="bg-muted/50 rounded-xl px-2 py-1 flex items-center justify-between h-12"
                          >
                            <div>
                              <p className="text-xs ml-2">
                                {v.responsibleName}
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="px-2 shadow rounded-full ">
                                  {CONTACTS_TYPES_LABELS[v.type]}
                                </span>
                                <span>{v.contact}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                className="flex items-center gap-2 p-2 rounded-full hover:bg-muted"
                                onClick={() =>
                                  handleEdit({
                                    id: v.id,
                                    type: v.type,
                                    contact: v.contact,
                                    responsibleName: v.responsibleName,
                                    deleted: v.deleted,
                                  })
                                }
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Edit2 size={12} />
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">Editar</p>
                                  </TooltipContent>
                                </Tooltip>
                              </button>

                              <DropdownMenu>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuTrigger className="rounded-full p-2 hover:bg-muted">
                                      <MoreHorizontal size={12} />
                                    </DropdownMenuTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">Mais Opções</p>
                                  </TooltipContent>
                                </Tooltip>

                                <DropdownMenuContent side="bottom" align="end">
                                  <DropdownMenuItem
                                    className={cn(
                                      "focus:bg-gradient-to-r focus:from-primary focus:to-primary/70 focus:text-sidebar-accent",
                                      "text-xs text-destructive"
                                    )}
                                  >
                                    <button
                                      onClick={() => handleDeleteContacts(v)}
                                    >
                                      Excluir Contato
                                    </button>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-center">
                        Nenhum contato cadastrado.
                      </p>
                    )}
                  </div>
                  <ScrollBar />
                </ScrollArea>

                <Button
                  onClick={() => setIsEditContact(true)}
                  className="self-center"
                >
                  Adicionar Contato
                </Button>
              </div>
            )}
            <ScrollBar />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
