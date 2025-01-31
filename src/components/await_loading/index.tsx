import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface AwaitLoadingProps {
  className?: string;
  sizeIcon?: number;
}

export const AwaitLoading = ({
  className = "",
  sizeIcon = 20,
}: AwaitLoadingProps) => {
  return (
    <div className={cn("w-full flex justify-center text-primary", className)}>
      <LoaderCircle size={sizeIcon} className="animate-spin" />
    </div>
  );
};
