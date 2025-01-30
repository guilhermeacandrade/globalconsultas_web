"use client";

import { TableInquiry } from "./_components/table_inquiry";
import { api } from "@/lib/api";
import { DialogInquiry } from "./_components/dialog_inquiry";
import { PlusCircle } from "lucide-react";
import { IUserProfile } from "@/utils/types/user.type";
import { IInquiry } from "@/utils/types/inquiry.type";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function InquiriesPage() {
  const { data: session } = useSession();
  console.log("🚀 ~ InquiriesPage ~ session:", session);
  console.log("🚀 ~ InquiriesPage ~ session.user:", session?.user);

  const [records, setRecords] = useState<IInquiry[] | []>([]);

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

  return (
    <div className="mt-3 px-2 max-w-5xl mx-auto">
      <div className="py-2 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Consultas</h3>

        <DialogInquiry
          trigger={
            <button className="flex items-center gap-1 bg-primary text-background py-2 px-3 rounded-lg text-sm hover:bg-primary/90">
              <PlusCircle size={20} />
              Nova Consulta
            </button>
          }
          dialogTitle="Nova Empresa"
        />
      </div>

      <div className="my-4">
        <TableInquiry inquiry={records} />
      </div>
    </div>
  );
}
