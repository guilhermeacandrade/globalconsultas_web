import { api } from "@/lib/api";
import { ICompany } from "@/utils/types/company.type";
import { DialogCompany } from "./_components/dialog_company";
import { TableCompany } from "./_components/table_company";
import { PlusCircle } from "lucide-react";

export default async function CompaniesPage() {
  const resp = await api.get("/company");
  const records: ICompany[] = resp.data.data;

  return (
    <div className="mt-3 px-2 max-w-5xl mx-auto">
      <div className="py-2 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Empresas</h3>

        <DialogCompany
          trigger={
            <button className="flex items-center gap-1 bg-primary text-background py-2 px-3 rounded-lg text-sm hover:bg-primary/90">
              <PlusCircle size={20} />
              Cadastrar Nova
            </button>
          }
          dialogTitle="Nova Empresa"
        />
      </div>

      <div className="my-4">
        <TableCompany companies={records} />
      </div>
    </div>
  );
}
