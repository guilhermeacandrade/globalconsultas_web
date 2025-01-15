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
import { createUser, updateUser } from "@/actions/users";

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
    })
    .superRefine((data, ctx) => {
      console.log("🚀 ~ .superRefine ~ edit:", edit);
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
    });

// export type TFormUserData = z.infer<typeof schema>;
export type TFormUserData = z.infer<ReturnType<typeof createSchema>>;

interface IFormUserProps {
  editUser?: IUser;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormUser({ closeModal, editUser }: IFormUserProps) {
  const [isPending, startTransition] = useTransition();

  const schema = createSchema(!!editUser);
  const form = useForm<TFormUserData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: editUser ? editUser.name : undefined,
      email: editUser ? editUser.email : undefined,
      password: undefined,
      profile: editUser ? editUser.profile : undefined,
    },
  });

  async function onSubmit(data: TFormUserData) {
    startTransition(async () => {
      try {
        console.log(data);

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

  return (
    <div className="px-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col pb-4"
        >
          <div className="flex flex-grow flex-col justify-center gap-2 ">
            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem className="">
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

                    <PopoverContent className="w-[200px] p-0">
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
                  <FormLabel>Senha</FormLabel>
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
