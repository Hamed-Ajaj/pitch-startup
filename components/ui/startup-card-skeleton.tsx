import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

const StartupCardSkeleton = () => {
  // return <Skeleton className="startup-card_skeleton" />;
  return (
    <>
      {[0, 1, 2, 3, 4].map((index) => (
        <Skeleton
          key={cn("skeleton", index)}
          className="startup-card_skeleton"
        />
      ))}
    </>
  );
};

export default StartupCardSkeleton;
