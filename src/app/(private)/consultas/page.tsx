import { IInquiry } from "@/utils/types/inquiry.type";
import { TableInquiry } from "./_components/table_inquiry";
import { api } from "@/lib/api";

export default async function InquiriesPage() {
  const resp = await api.get("/inquiry");
  const records: IInquiry[] = resp.data.data;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col items-center justify-center my-10">
        <h1 className="text-2xl font-semibold">Consultas</h1>
        <p className="text-sm">
          Página em desenvolvimento, em breve estará liberada...
        </p>
      </div>

      <TableInquiry inquiry={records} />
    </div>
  );
}
