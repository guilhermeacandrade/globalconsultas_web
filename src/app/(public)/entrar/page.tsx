import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { FormSignin } from "./_components/form_signin";

export default function LoginPage() {
  return (
    <div className="flex h-dvh w-full items-center justify-center p-9 xl:p-0 bg-background">
      <div className="flex h-[500px] w-full items-center justify-center gap-6 ">
        {/* LEFT - LOGO */}
        <div className="hidden lg:flex lg:h-full lg:items-center lg:border-r lg:border-border ">
          <Image
            src="/assets/logo.png"
            alt="Grupo FR Facilities Logotipo"
            className="max-w-96"
            width={600}
            height={200}
          />
        </div>

        {/* RIGHT - FORM AUTH */}

        <Card className="flex h-full lg:max-h-[450px] max-w-[350px] flex-col ">
          <CardHeader className="lg:mt-6">
            <Image
              src="/assets/logo.png"
              alt="Grupo FR Facilities Logotipo"
              className="mx-auto mb-6 items-center lg:hidden"
              width={100}
              height={30}
            />
            <CardTitle className="text-xl lg:text-2xl">Autenticação</CardTitle>
            <CardDescription>
              Insira suas credenciais para entrar no sistema.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow">
            <FormSignin />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
