"use client";

import { api } from "@/lib/api";
import { IInquiry } from "@/utils/types/inquiry.type";
import { IUserProfile } from "@/utils/types/user.type";
import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";

interface UseInquiriesResponseProps {
  inquiries: IInquiry[] | [];
  isLoading: boolean;
  isError: any;
  mutate: KeyedMutator<any>;
  isValidating: boolean;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useInquiries(): UseInquiriesResponseProps {
  const { data: session } = useSession();

  let url: string = "/inquiry";

  if (session?.user.profile === IUserProfile.INVESTIGATOR)
    url = url + `/investigator/${session.user.id}`;
  if (session?.user.profile === IUserProfile.COMPANY)
    url = url + `/company/${session.user.companyId}`;
  if (session?.user.profile === IUserProfile.BRANCH)
    url = url + `/branch/${session.user.branchId}`;

  const { data, error, isLoading, mutate, isValidating } = useSWR(url, fetcher);

  return {
    inquiries: data?.data,
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}
