import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { IUser } from "@/utils/types/user.type";

interface TableCompanyProps {
  user: IUser[];
}

export const TableUser = ({ user }: TableCompanyProps) => {
  return (
    <div>
      <DataTable columns={columns} data={user} />
    </div>
  );
};
