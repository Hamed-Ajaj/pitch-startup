"use client";
import React from "react";
import { Button } from "./button";
import { ArrowDown, ArrowUp, ArrowUpSquare } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { auth } from "@/auth";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { downvote, upvote } from "@/lib/actions";

const UpvoteDownvoteButtons = ({
  postId,
  upvotes,
  upvotedBy,
  downvotes,
  downvotedBy,
}: {
  postId: string;
  upvotes: number;
  upvotedBy: string[];
  downvotes: number;
  downvotedBy: string[];
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
  const handleUpvote = async () => {
    if (!session.data) return;
    try {
      setIsLoading(true);
      if (existingUpvote) {
        setUpvoteCount((prev) => prev - 1);
        setIsUpvoted(!isUpvoted);
      } else {
        setUpvoteCount((prev) => prev + 1);
        setIsUpvoted(!isUpvoted);
      }
      const res = await upvote(postId);
      console.log(res);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (!session.data) return;
    try {
      if (existingDownvote) {
        setDownvoteCount((prev) => prev - 1);
        setIsDownvoted(!isDownvoted);
      } else {
        setDownvoteCount((prev) => prev + 1);
        setIsDownvoted(!isDownvoted);
      }
      const res = await downvote(postId);
      console.log(res);
    } catch (error) {
      console.error(error);
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
