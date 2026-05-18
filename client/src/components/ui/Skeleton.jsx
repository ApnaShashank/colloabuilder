import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/[0.03] border border-white/[0.05]", className)}
      {...props}
    />
  );
}

export default Skeleton;
export { Skeleton };
