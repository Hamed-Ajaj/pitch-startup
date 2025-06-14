"use client";
import React from "react";
import { Button } from "./button";
import { ArrowDown, ArrowUp, ArrowUpSquare } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { downvote, upvote } from "@/lib/actions";

const UpvoteDownvoteButtons = ({
  postId,
  upvotes,
  downvotes,
}: {
  postId: string;
  upvotes: number;
  downvotes: number;
}) => {
  const session = useSession();
  const existingUpvote = upvotes.find(
    (vote: any) => vote.author._ref === session?.data.id,
  );
  const existingDownvote = downvotes.find(
    (vote: any) => vote.author._ref === session?.data.id,
  );

  const [upvoteCount, setUpvoteCount] = React.useState(upvotes.length || 0);
  const [downvoteCount, setDownvoteCount] = React.useState(
    downvotes.length || 0,
  );
  const [isUpvoted, setIsUpvoted] = React.useState(existingUpvote);
  const [isDownvoted, setIsDownvoted] = React.useState(existingDownvote);
  const [isLoading, setIsLoading] = React.useState(false);
  const clickInProgress = React.useRef(false);

  const handleUpvote = async () => {
    if (clickInProgress.current) return;
    clickInProgress.current = true;

    if (!session.data) {
      toast.error("You must be logged in to vote");
      clickInProgress.current = false;
      return;
    }

    setIsLoading(true);

    try {
      if (isUpvoted) {
        setUpvoteCount((prev) => prev - 1);
        setIsUpvoted(false);
      } else {
        setUpvoteCount((prev) => prev + 1);
        if (isDownvoted) {
          setDownvoteCount((prev) => prev - 1);
          setIsDownvoted(false);
        }
        setIsUpvoted(true);
      }

      await upvote(postId);
    } catch (error: any) {
      toast.error(error.message || "Failed to upvote");
    } finally {
      setIsLoading(false);
      clickInProgress.current = false;
    }
  };

  const handleDownvote = async () => {
    if (clickInProgress.current) return;
    clickInProgress.current = true;

    if (!session.data) {
      toast.error("You must be logged in to vote");
      clickInProgress.current = false;
      return;
    }

    setIsLoading(true);

    try {
      if (isDownvoted) {
        setDownvoteCount((prev) => prev - 1);
        setIsDownvoted(false);
      } else {
        setDownvoteCount((prev) => prev + 1);
        if (isUpvoted) {
          setUpvoteCount((prev) => prev - 1);
          setIsUpvoted(false);
        }
        setIsDownvoted(true);
      }

      const res = await downvote(postId);
      if (res.status !== "SUCCESS") {
        toast.error("Failed to downvote");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to downvote");
    } finally {
      setIsLoading(false);
      clickInProgress.current = false;
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        size={"sm"}
        variant={"outline"}
        className={`border-default cursor-pointer ${isUpvoted ? "bg-default/60 text-white border-black" : "bg-transparent border-default"}`}
        onClick={handleUpvote}
        disabled={isDownvoted || isLoading}
      >
        <ArrowUp className="size-4" />
        {upvoteCount}
      </Button>
      <Button
        size="sm"
        variant={"outline"}
        className={`border-default cursor-pointer ${isDownvoted ? "bg-default/60 text-white border-black" : "bg-transparent border-default"}`}
        onClick={handleDownvote}
        disabled={isUpvoted || isLoading}
      >
        <ArrowDown />
        {downvoteCount}
      </Button>
    </div>
  );
};

export default UpvoteDownvoteButtons;
