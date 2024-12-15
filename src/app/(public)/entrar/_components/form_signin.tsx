"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
// import { sleep } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
// import { signIn } from "@/lib/auth";

const schema = z.object({
  email: z
    .string({ required_error: "Obrigatório." })
    .trim()
    .email({ message: "E-mail inválido." }),
  password: z.string({ required_error: "Obrigatório." }),
});

export type FormData = z.infer<typeof schema>;

export function FormSignin() {
  const route = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: FormData) {
    startTransition(async () => {
      try {
        const auth = await signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: "/",
          redirect: false,
        });

        if (auth?.error) {
          if (auth?.error === "CredentialsSignin") {
            form.setError("root", {
              type: "manual",
              message: "Usuário e/ou senha inválido(s).",
            });
          } else {
            form.setError("root", {
              type: "manual",
              message: "Falha na autenticação.",
            });
          }

          return;
        }

        route.replace("/");
      } catch (err) {
        form.setError("root", {
          type: "",
          message: `Falha na autenticação: ${err}`,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className="flex h-full flex-col pb-4"
      >
        <div className="flex flex-grow flex-col justify-center gap-2 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                {/* <FormLabel>Usuário</FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="E-mail"
                    className="focus-visible:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="px-2 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                {/* <FormLabel>Senha</FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="Senha"
                    className="focus-visible:ring-primary"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="px-2 text-xs" />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="mt-1 text-center text-xs text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <LoaderCircle size={24} className="animate-spin" />
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </Form>
  );
}
