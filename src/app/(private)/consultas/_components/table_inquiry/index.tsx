import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { IInquiry } from "@/utils/types/inquiry.type";
import { auth } from "@/lib/auth";
import { IUserProfile } from "@/utils/types/user.type";

interface TableInquiryProps {
  inquiry: IInquiry[];
}

export const TableInquiry = async ({ inquiry }: TableInquiryProps) => {
  const session = await auth();

  return (
    <div>
      <DataTable
        columns={columns}
        data={inquiry}
        visibilityColumns={{
          filial: session?.user.profile !== IUserProfile.BRANCH,
        }}
      />
    </div>
  );
};
