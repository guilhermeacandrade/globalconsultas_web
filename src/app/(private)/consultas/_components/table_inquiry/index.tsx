"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
// import { IInquiry } from "@/utils/types/inquiry.type";
import { IUserProfile } from "@/utils/types/user.type";
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";
import { useInquiries } from "@/hooks/use_inquiries";
import { AwaitLoading } from "@/components/await_loading";

// interface TableInquiryProps {
//   inquiry: IInquiry[];
// }

// export const TableInquiry = ({ inquiry }: TableInquiryProps) => {
export const TableInquiry = () => {
  const { data: session } = useSession();
  const col = columns({ session });

  const { inquiries, isLoading, isError } = useInquiries();

  if (!session) return <AwaitLoading />;

  if (isLoading) return <AwaitLoading />;
  if (isError)
    return (
      <div>
        <h3>Erro ao carregar dados...</h3>
      </div>
    );

  return (
    <div>
      <DataTable
        columns={col}
        data={inquiries}
        visibilityColumns={{
          filial: session?.user.profile !== IUserProfile.BRANCH,
          investigator: session?.user.profile === IUserProfile.ADMIN,
        }}
      />
    </div>
  );
};
