import { api } from "@/lib/api";
import { IRestriction } from "@/utils/types/restriction.type";
import { PlusCircle } from "lucide-react";
import { DialogRestriction } from "./_components/dialog_restriction";
import { TableRestriction } from "./_components/table_restriction";

export default async function UsersPage() {
  const resp = await api.get("/restriction");
  const records: IRestriction[] = resp.data.data;

  return (
    <div className="mt-3 px-2 max-w-5xl mx-auto">
      <div className="py-2 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Restrições</h3>

        <DialogRestriction
          trigger={
            <button className="flex items-center gap-1 bg-primary text-background py-2 px-3 rounded-lg text-sm hover:bg-primary/90">
              <PlusCircle size={20} />
              Cadastrar Nova
            </button>
          }
          dialogTitle="Nova Restrição"
        />
      </div>

      <div className="my-4">
        <TableRestriction restriction={records} />
      </div>
    </div>
  );
}
