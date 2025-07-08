import { cn } from "@/lib/utils";

const NeumorphWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative [box-shadow:0_0_10px_-1px_#00000040] h-full border border-black/50 bg-[#212121]",
        "after:absolute after:inset-0 after:pointer-events-none after:content-[''] after:border-t-2 after:border-r-2 after:border-[#2A2A2A]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default NeumorphWrapper;
