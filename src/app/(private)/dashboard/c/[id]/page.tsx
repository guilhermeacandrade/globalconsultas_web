"use client";

import { ChartInquiries } from "@/app/(private)/_components/ChartConsult";
import { api } from "@/lib/api";
import { ICompany } from "@/utils/types/company.type";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardCompanyPage() {
  const params = useParams();
  const [company, setCompany] = useState<ICompany | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const getDataCompany = async (idCompany: string) => {
      const res = await api.get(`/company/${idCompany}`);
      const resCompany = await res.data.data;

      // console.log("🚀 ~ getDataCompany ~ resCompany:", resCompany);
      setCompany(res.data.data);

      if (resCompany.imageLogoUrl) {
        setLogoUrl(
          `${process.env.NEXT_PUBLIC_API_URL}${resCompany.imageLogoUrl}`
        );
      }
    };

    const { id } = params;
    if (id) {
      getDataCompany(id as string);
    }
  }, [params]);

  // console.log("🚀 ~ PanelDynamicPage ~ params:", params);

  return (
    <div className="mt-8 px-4">
      <div className="flex gap-3 items-center mb-8">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt="Pré-visualização"
            className="w-32 h-32 object-contain"
            width={250}
            height={250}
          />
        )}

        <div>
          <h1 className="text-2xl font-semibold">Dashboard {company?.name}</h1>
          <p className="text-sm text-gray-400">Gestão de filiais</p>
          {/* <p className="text-xs text-gray-200">ID: {params.id}</p> */}
        </div>
      </div>

      <div className="">
        <ChartInquiries />
      </div>
    </div>
  );
}
