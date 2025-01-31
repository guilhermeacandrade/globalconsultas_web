"use client";

import { api } from "@/lib/api";
import { IUserProfile } from "@/utils/types/user.type";
import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";

export interface IChartInquiry {
  date: string;
  inquiries: number;
}

interface UseChartInquiriesResponseProps {
  chartData: IChartInquiry[] | [];
  isLoading: boolean;
  isError: any;
  mutate: KeyedMutator<any>;
  isValidating: boolean;
}

interface UseChartInquiresProps {
  timeRange: string; //"thisMonth" | "lastMonth";
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useChartInquiries({
  timeRange,
}: UseChartInquiresProps): UseChartInquiriesResponseProps {
  const { data: session } = useSession();

  let searchId: string | undefined = "";

  const params = {
    timeRange,
    profile: session?.user.profile,
  };

  if (session?.user.profile === IUserProfile.INVESTIGATOR) {
    searchId = session?.user.id as string;
  }

  if (session?.user.profile === IUserProfile.COMPANY) {
    searchId = session?.user.companyId as string;
  }

  if (session?.user.profile === IUserProfile.BRANCH) {
    searchId = session?.user.branchId as string;
  }

  const url: string = `/dashboard/chart-consult?${new URLSearchParams({
    ...params,
    searchId,
  }).toString()}`;

  const { data, error, isLoading, mutate, isValidating } = useSWR(url, fetcher);

  return {
    chartData: data?.data,
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}
