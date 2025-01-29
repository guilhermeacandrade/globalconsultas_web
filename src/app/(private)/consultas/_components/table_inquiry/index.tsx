"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { IInquiry } from "@/utils/types/inquiry.type";
import { auth } from "@/lib/auth";
import { IUserProfile } from "@/utils/types/user.type";
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";

interface TableInquiryProps {
  inquiry: IInquiry[];
}

export const TableInquiry = ({ inquiry }: TableInquiryProps) => {
  // const session = await auth();
  const { data: session } = useSession();

  const col = columns({ session });

  if (!session)
    return (
      <div className="w-full flex justify-center text-primary">
        <LoaderCircle size={20} className="animate-spin" />
      </div>
    );

  return (
    <div>
      <DataTable
        columns={col}
        data={inquiry}
        visibilityColumns={{
          filial: session?.user.profile !== IUserProfile.BRANCH,
          investigator: session?.user.profile === IUserProfile.ADMIN,
        }}
      />
    </div>
  );
};
