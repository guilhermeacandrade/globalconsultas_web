import { api } from "@/lib/api";
import { ICompany } from "@/utils/types/company.type";
import { DialogCompany } from "./_components/dialog_company";

export default async function CompaniesPage() {
  const resp = await api.get("/company");
  const records: ICompany[] | null = resp.data.data;

  return (
    <div className="mt-3 px-2">
      <div className="py-2 flex justify-between">
        <h3 className="text-xl font-semibold">Empresas</h3>

        <DialogCompany />
      </div>

      <div className="my-4">
        {records?.map((record, idx) => {
          return <p key={idx}>{record.name}</p>;
        })}
      </div>
    </div>
  );
}
