"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { IInquiry } from "@/utils/types/inquiry.type";
import { IUserProfile } from "@/utils/types/user.type";
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// interface TableInquiryProps {
//   inquiry: IInquiry[];
// }

// export const TableInquiry = ({ inquiry }: TableInquiryProps) => {
export const TableInquiry = () => {
  const { data: session } = useSession();
  const [records, setRecords] = useState<IInquiry[] | [] | null>(null);

  let url: string = "/inquiry";

  if (session?.user.profile === IUserProfile.INVESTIGATOR)
    url = url + `/investigator/${session.user.id}`;
  if (session?.user.profile === IUserProfile.COMPANY)
    url = url + `/company/${session.user.companyId}`;
  if (session?.user.profile === IUserProfile.BRANCH)
    url = url + `/branch/${session.user.branchId}`;

  useEffect(() => {
    const getRecords = async () => {
      const resp = await api.get(url);
      const records: IInquiry[] = resp.data.data;

      setRecords(records);
    };

    getRecords();
  }, []);

  const col = columns({ session });

  if (!session)
    return (
      <div className="w-full flex justify-center text-primary">
        <LoaderCircle size={20} className="animate-spin" />
      </div>
    );

  if (!records)
    return (
      <div className="w-full flex justify-center text-primary">
        <LoaderCircle size={20} className="animate-spin" />
      </div>
    );

  return (
    <div>
      <DataTable
        columns={col}
        data={records}
        visibilityColumns={{
          filial: session?.user.profile !== IUserProfile.BRANCH,
          investigator: session?.user.profile === IUserProfile.ADMIN,
        }}
      />
    </div>
  );
};
