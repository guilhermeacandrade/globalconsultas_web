import { cn } from "@/lib/utils";
import {
  IInquiry,
  IResultInquiries,
  RESULT_INQUIRY_LABELS,
} from "@/utils/types/inquiry.type";
import { IUserProfile } from "@/utils/types/user.type";
import { ShieldBan, ShieldCheck, ShieldEllipsis } from "lucide-react";

type BadgeResultProps = {
  inquiry: IInquiry;
  userProfile: IUserProfile;
  className?: string;
};

export const BadgeResultInquiry = ({
  inquiry,
  userProfile,
  className,
}: BadgeResultProps) => {
  return (
    <div
      className={cn(
        "flex w-full  max-w-32 items-center justify-center px-2 py-1 font-semibold gap-2 text-xs rounded-xl bg-amber-300/40 text-amber-600",
        {
          "bg-green-500/10 text-green-500":
            inquiry.result === IResultInquiries.APPROVED &&
            (inquiry.adminApprovalDate ||
              [IUserProfile.ADMIN, IUserProfile.INVESTIGATOR].includes(
                userProfile
              )),
        },
        {
          "bg-red-500/10 text-red-500":
            inquiry.result === IResultInquiries.REJECTED &&
            (inquiry.adminApprovalDate ||
              [IUserProfile.ADMIN, IUserProfile.INVESTIGATOR].includes(
                userProfile
              )),
        },
        {
          "bg-cyan-500/10 text-cyan-500":
            !inquiry.adminApprovalDate &&
            ![IUserProfile.INVESTIGATOR].includes(userProfile) &&
            inquiry.investigatorId &&
            inquiry.endDate &&
            ![IUserProfile.ADMIN].includes(userProfile),
        },
        className
      )}
    >
      <div className="">
        {inquiry.result === IResultInquiries.APPROVED &&
          (inquiry.adminApprovalDate ||
            [IUserProfile.ADMIN, IUserProfile.INVESTIGATOR].includes(
              userProfile
            )) && <ShieldCheck size={12} />}
        {inquiry.result === IResultInquiries.REJECTED &&
          (inquiry.adminApprovalDate ||
            [IUserProfile.ADMIN, IUserProfile.INVESTIGATOR].includes(
              userProfile
            )) && <ShieldBan size={12} />}
        {((![IUserProfile.ADMIN, IUserProfile.INVESTIGATOR].includes(
          userProfile
        ) &&
          !inquiry.adminApprovalDate) ||
          ([IUserProfile.ADMIN, IUserProfile.INVESTIGATOR].includes(
            userProfile
          ) &&
            !inquiry.result)) && <ShieldEllipsis size={12} />}
      </div>

      <span className="">
        {inquiry.result &&
        (inquiry.adminApprovalDate ||
          [IUserProfile.ADMIN, IUserProfile.INVESTIGATOR].includes(userProfile))
          ? RESULT_INQUIRY_LABELS[inquiry.result]
          : userProfile === IUserProfile.INVESTIGATOR
          ? "Pendente"
          : inquiry.investigatorId
          ? "Em Andamento"
          : "Aguardando"}
      </span>
    </div>
  );
};
