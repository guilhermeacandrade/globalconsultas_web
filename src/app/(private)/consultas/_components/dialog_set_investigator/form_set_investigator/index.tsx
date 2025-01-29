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
import { cn, durationToast } from "@/lib/utils";
import { IInquiry } from "@/utils/types/inquiry.type";
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
import { IUser, IUserProfile } from "@/utils/types/user.type";
import { updateSetInvestigator } from "@/actions/inquiries/update_set_investigator";

const schema = z.object({
  investigatorId: z
    .string({ required_error: "Obrigatório." })
    .min(1, "Obrigatório."),
});
export type TFormSetInvestigatorData = z.infer<typeof schema>;

interface IFormSetInvestigatorProps {
  editInquiry: IInquiry;
  closeModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormSetInvestigator({
  editInquiry,
  closeModal,
}: IFormSetInvestigatorProps) {
  const [isPending, startTransition] = useTransition();
  const [listInvestigators, setListInvestigatorss] = useState<IUser[] | []>([]);

  const form = useForm<TFormSetInvestigatorData>({
    resolver: zodResolver(schema),
    defaultValues: {
      investigatorId: editInquiry.investigatorId || "",
    },
  });

  async function handleSend(data: TFormSetInvestigatorData) {
    startTransition(async () => {
      try {
        // update
        const inquiry = await updateSetInvestigator({
          ...data,
          id: editInquiry.id,
        });

        toast({
          title: "Sucesso!",
          description: (
            <p className="flex items-center gap-3">
              <CheckCheck className="text-green-500" />
              Consulta enviada com sucesso para{" "}
              {
                listInvestigators.find(
                  (investigator) => investigator.id === data.investigatorId
                )?.name
              }
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
    const fetchInvestigators = async () => {
      try {
        const resp = await api.get("/user/investigators");
        const respData: IUser[] = await resp.data.data;

        setListInvestigatorss(respData);
      } catch (error) {
        console.log("🚀 ~ fetchInvestigators ~ error:", error);
      }
    };

    fetchInvestigators();
  }, []);

  return (
    <div className="px-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSend)}
          className="flex h-full flex-col pb-4 px-1"
        >
          <div className="flex flex-grow flex-col justify-center gap-2 ">
            <FormField
              control={form.control}
              name="investigatorId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Consultor</FormLabel>
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
                                form.formState.errors.investigatorId,
                            }
                          )}
                        >
                          {field.value
                            ? listInvestigators.find(
                                (investigator) =>
                                  investigator.id === field.value
                              )?.name
                            : "Selecionar..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0 z-[99]">
                      <Command>
                        <CommandInput
                          placeholder="Buscar consultor..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            Nenhum consultor encontrada.
                          </CommandEmpty>
                          <CommandGroup>
                            {listInvestigators.map((investigator) => (
                              <CommandItem
                                value={investigator.name}
                                key={investigator.id}
                                onSelect={() => {
                                  form.setValue(
                                    "investigatorId",
                                    investigator.id
                                  );
                                }}
                              >
                                {investigator.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    investigator.id === field.value
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
