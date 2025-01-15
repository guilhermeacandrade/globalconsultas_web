import { api } from "@/lib/api";
import { IBranch } from "@/utils/types/branch.type";
import { PlusCircle } from "lucide-react";
import { DialogBranch } from "./_components/dialog_branch";
import { TableBranch } from "./_components/table_branch";

export default async function BranchesPage() {
  const resp = await api.get("/branch");
  const records: IBranch[] = resp.data.data;

  return (
    <div className="mt-3 px-2 max-w-5xl mx-auto">
      <div className="py-2 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Filiais</h3>

        <DialogBranch
          trigger={
            <button className="flex items-center gap-1 bg-primary text-background py-2 px-3 rounded-lg text-sm hover:bg-primary/90">
              <PlusCircle size={20} />
              Cadastrar Nova
            </button>
          }
          dialogTitle="Nova Filial"
        />
      </div>

      <div className="my-4">
        <TableBranch branches={records} />
      </div>
    </div>
  );
}
