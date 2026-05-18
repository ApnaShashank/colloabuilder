import React from "react";

export default function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/[0.03] border border-white/[0.05] ${className}`}
      {...props}
    />
  );
}
