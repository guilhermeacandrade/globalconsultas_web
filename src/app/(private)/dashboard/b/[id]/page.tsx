"use client";

import { api } from "@/lib/api";
import { IBranch } from "@/utils/types/branch.type";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardBranchPage() {
  const params = useParams();
  const [branch, setBranch] = useState<IBranch | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const getDataBranch = async (idBranch: string) => {
      const res = await api.get(`/branch/${idBranch}`);
      const resBranch: IBranch = await res.data.data;

      // console.log("🚀 ~ getDataCompany ~ resBranch:", resBranch);
      setBranch(res.data.data);

      if (resBranch.company.imageLogoUrl) {
        setLogoUrl(
          `${process.env.NEXT_PUBLIC_API_URL}${resBranch.company.imageLogoUrl}`
        );
      }
    };

    const { id } = params;
    if (id) {
      getDataBranch(id as string);
    }
  }, [params]);

  // console.log("🚀 ~ PanelDynamicPage ~ params:", params);

  return (
    <div className="h-full px-4 ">
      <div className="h-full flex flex-col gap-2 items-center justify-center ">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt="Pré-visualização"
            className="w-80 h-80 object-contain"
            width={500}
            height={500}
          />
        )}

        <div className="flex flex-col items-center">
          {/* <h1 className="text-2xl font-semibold">Dashboard Filial</h1>
          <p className="text-sm text-gray-400">{branch?.fantasyName}</p> */}

          <p className="text-sm text-gray-400">Filial</p>
          <h1 className="text-2xl font-semibold">{branch?.fantasyName}</h1>
        </div>
      </div>
    </div>
  );
}
