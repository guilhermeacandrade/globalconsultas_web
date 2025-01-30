import { TableInquiry } from "./_components/table_inquiry";
import { api } from "@/lib/api";
import { DialogInquiry } from "./_components/dialog_inquiry";
import { PlusCircle } from "lucide-react";
import { IUserProfile } from "@/utils/types/user.type";
import { IInquiry } from "@/utils/types/inquiry.type";
import { auth } from "@/lib/auth";

export default async function InquiriesPage() {
  const session = await auth();

  // let url: string = "/inquiry";

  // if (session?.user.profile === IUserProfile.INVESTIGATOR)
  //   url = url + `/investigator/${session.user.id}`;
  // if (session?.user.profile === IUserProfile.COMPANY)
  //   url = url + `/company/${session.user.companyId}`;
  // if (session?.user.profile === IUserProfile.BRANCH)
  //   url = url + `/branch/${session.user.branchId}`;

  // const resp = await api.get(url);
  const resp = await api.get("/inquiry");
  const records: IInquiry[] = resp.data.data;

  // return (
  //   <div>
  //     <h1>Consultas teste</h1>
  //   </div>
  // );

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
