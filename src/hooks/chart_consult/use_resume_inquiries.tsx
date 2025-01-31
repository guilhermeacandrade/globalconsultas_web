"use client";

import { api } from "@/lib/api";
import { IUserProfile } from "@/utils/types/user.type";
import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";

interface UseChartInquiresProps {
  timeRange: string;
}

export interface IResumeInquiries {
  requests: number;
  pending: number;
  close: number;
}

interface UseChartInquiriesResponseProps {
  resumeData: IResumeInquiries;
  isLoading: boolean;
  isError: any;
  mutate: KeyedMutator<any>;
  isValidating: boolean;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useResumeInquiries({
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

  const url: string = `/dashboard/resume-consults?${new URLSearchParams({
    ...params,
    searchId,
  }).toString()}`;

  const { data, error, isLoading, mutate, isValidating } = useSWR(url, fetcher);

  return {
    resumeData: data?.data,
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}
