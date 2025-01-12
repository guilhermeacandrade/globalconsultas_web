import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { IBranch } from "@/utils/types/branch.type";

interface TableBranchProps {
  branches: IBranch[];
}

export const TableBranch = ({ branches }: TableBranchProps) => {
  return (
    <div>
      <DataTable columns={columns} data={branches} />
    </div>
  );
};
