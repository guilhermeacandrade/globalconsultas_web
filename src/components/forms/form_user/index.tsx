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
import { IUser, IUserProfile, PROFILE_OPTIONS } from "@/utils/types/user.type";
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
import { Switch } from "@/components/ui/switch";
import { createUser, updateUser } from "@/actions/users";
import { ICompany } from "@/utils/types/company.type";
import { api } from "@/lib/api";
import { IBranch } from "@/utils/types/branch.type";

const createSchema = (edit: boolean) =>
  z
    .object({
      name: z.string({ required_error: "Obrigatório." }).trim(),
      email: z
        .string({ required_error: "Obrigatório." })
        .trim()
        .min(1, "Obrigatório.")
        .email({ message: "E-mail inválido." }),
      password: z.string().optional(),
      profile: z.enum(Object.values(IUserProfile) as [IUserProfile], {
        required_error: "Obrigatório.",
      }),
      status: z.boolean(),
      companyId: z.string().optional(),
      branchId: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!edit) {
        if (!data.password) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Obrigatório",
            path: ["password"],
          });
        } else if (data.password.length < 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A senha deve conter no mínimo 6 caracteres.",
            path: ["password"],
          });
        }
      }

      if (data.profile === IUserProfile.COMPANY && !data.companyId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Obrigatório",
          path: ["companyId"],
        });
      }

      if (data.profile === IUserProfile.BRANCH && !data.branchId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Obrigatório",
          path: ["branchId"],
        });
      }
    });

// export type TFormUserData = z.infer<typeof schema>;
export type TFormUserData = z.infer<ReturnType<typeof createSchema>>;

interface IFormUserProps {
  editUser?: IUser;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormUser({ closeModal, editUser }: IFormUserProps) {
  const [isPending, startTransition] = useTransition();
  const [listCompanies, setListCompanies] = useState<ICompany[]>([]);
  const [listBranches, setListBranches] = useState<IBranch[]>([]);

  const schema = createSchema(!!editUser);
  const form = useForm<TFormUserData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: editUser ? editUser.name : "",
      email: editUser ? editUser.email : "",
      password: "",
      profile: editUser ? editUser.profile : undefined,
      status: editUser ? editUser.status : true,
      companyId:
        editUser && editUser.companyId ? editUser.companyId : undefined,
      branchId: editUser && editUser.branchId ? editUser.branchId : undefined,
    },
  });

  const watchProfileValue = form.watch("profile");
  // console.log("🚀 ~ FormUser ~ watchProfileValue:", watchProfileValue);

  async function onSubmit(data: TFormUserData) {
    startTransition(async () => {
      try {
        if (editUser) {
          // update
          const user = await updateUser({
            ...data,
            id: editUser.id,
          });
        } else {
          // create
          const user = await createUser(data);
          form.reset();
        }

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              {editUser
                ? "Usuário editado com sucesso."
                : "Usuário cadastrado com sucesso."}
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
        const resp = await api.get("/company");
        const respData: ICompany[] = await resp.data.data;

        setListCompanies(respData);
      } catch (error) {
        console.log("🚀 ~ fetchCompanies ~ error:", error);
      }
    };

    const fetchBranches = async () => {
      try {
        const resp = await api.get("/branch");
        const respData: IBranch[] = await resp.data.data;

        setListBranches(respData);
      } catch (error) {
        console.log("🚀 ~ fetchBranches ~ error:", error);
      }
    };

    fetchCompanies();
    fetchBranches();
  }, []);

  return (
    <div className="px-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col pb-4 px-1"
        >
          <div className="flex flex-grow flex-col justify-center gap-2 ">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Perfil do Usuário</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            // disabled={data?.user.profile === "USER"}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? PROFILE_OPTIONS.find(
                                  (profile) => profile.value === field.value
                                )?.label
                              : "Selecione um perfil"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput
                            placeholder="Procurar perfil..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Nenhum perfil.</CommandEmpty>
                            <CommandGroup>
                              {PROFILE_OPTIONS.map((profile) => (
                                <CommandItem
                                  value={profile.label}
                                  key={profile.value}
                                  onSelect={() => {
                                    form.setValue("profile", profile.value);
                                  }}
                                >
                                  {profile.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      profile.value === field.value
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
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4 items-center">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!!!editUser}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {watchProfileValue === IUserProfile.COMPANY && (
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
            )}

            {watchProfileValue === IUserProfile.BRANCH && (
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
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Nome</FormLabel>
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
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>E-mail</FormLabel>
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
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{editUser ? "Nova Senha" : "Senha"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      className="focus-visible:ring-primary"
                      type="password"
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
