"use client";

import { useParams } from "next/navigation";

export default function DashboardCompanyPage() {
  const params = useParams();

  console.log("🚀 ~ PanelDynamicPage ~ params:", params);

  return (
    <div className="mt-8 px-2">
      <h1 className="text-2xl font-semibold">Rota Dinâmica</h1>
      <p>{params.id}</p>
    </div>
  );
}
