import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { IRestriction } from "@/utils/types/restriction.type";

interface TableRestrictionProps {
  restriction: IRestriction[];
}

export const TableRestriction = ({ restriction }: TableRestrictionProps) => {
  return (
    <div>
      <DataTable columns={columns} data={restriction} />
    </div>
  );
};
