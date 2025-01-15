import { api } from "@/lib/api";
import { IUser } from "@/utils/types/user.type";
import { PlusCircle } from "lucide-react";
import { DialogUser } from "./_components/dialog_user";
import { TableUser } from "./_components/table_user";

export default async function UsersPage() {
  const resp = await api.get("/user");
  const records: IUser[] = resp.data.data;

  return (
    <div className="mt-3 px-2 max-w-5xl mx-auto">
      <div className="py-2 flex justify-between">
        <h3 className="text-xl font-semibold">Usuários</h3>

        <DialogUser
          trigger={
            <button className="flex items-center gap-1 bg-primary text-background py-2 px-3 rounded-lg text-sm hover:bg-primary/90">
              <PlusCircle size={20} />
              Cadastrar Novo
            </button>
          }
          dialogTitle="Novo Usuário"
        />
      </div>

      <div className="my-4">
        <TableUser user={records} />
      </div>
    </div>
  );
}
