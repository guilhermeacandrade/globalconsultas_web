import { cn } from "@/lib/utils";
import {
  IResultInquiries,
  RESULT_INQUIRY_LABELS,
} from "@/utils/types/inquiry.type";
import { ShieldBan, ShieldCheck, ShieldEllipsis } from "lucide-react";

type BadgeResultProps = {
  inquiryResult: IResultInquiries | null;
  inquiryInvestigator: boolean;
  className?: string;
};

export const BadgeResultInquiry = ({
  inquiryResult,
  inquiryInvestigator,
  className,
}: BadgeResultProps) => {
  return (
    <div
      className={cn(
        "flex w-full  max-w-32 items-center justify-center px-2 py-1 font-semibold gap-2 text-xs rounded-xl bg-amber-300/40 text-amber-600",
        {
          "bg-green-500/10 text-green-500":
            inquiryResult === IResultInquiries.APPROVED,
        },
        {
          "bg-red-500/10 text-red-500":
            inquiryResult === IResultInquiries.REJECTED,
        },
        {
          "bg-cyan-500/10 text-cyan-500": !inquiryResult && inquiryInvestigator,
        },
        className
      )}
    >
      <div className="">
        {inquiryResult === IResultInquiries.APPROVED && (
          <ShieldCheck size={12} />
        )}
        {inquiryResult === IResultInquiries.REJECTED && <ShieldBan size={12} />}
        {inquiryResult !== IResultInquiries.APPROVED &&
          inquiryResult !== IResultInquiries.REJECTED && (
            <ShieldEllipsis size={12} />
          )}
      </div>

      <span className="">
        {inquiryResult
          ? RESULT_INQUIRY_LABELS[inquiryResult]
          : inquiryInvestigator
          ? "Em Andamento"
          : "Aguardando"}
      </span>
    </div>
  );
};
