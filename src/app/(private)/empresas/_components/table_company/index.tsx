import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { ICompany } from "@/utils/types/company.type";

interface TableCompanyProps {
  companies: ICompany[];
}

export const TableCompany = ({ companies }: TableCompanyProps) => {
  return (
    <div>
      <DataTable columns={columns} data={companies} />
    </div>
  );
};
