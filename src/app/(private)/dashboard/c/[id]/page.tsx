"use client";

import { useParams } from "next/navigation";

export default function DashboardCompanyPage() {
  const params = useParams();

  // console.log("🚀 ~ PanelDynamicPage ~ params:", params);

  return (
    <div className="mt-8 px-2">
      <h1 className="text-2xl font-semibold">
        Painel da Empresa - Acompanhamento das Filiais
      </h1>
      <p>ID Empresa: {params.id}</p>
    </div>
  );
}
