"use client";
import React from "react";
import { Button } from "./button";
import { Trash } from "lucide-react";
import { client } from "@/sanity/lib/client";

const DeleteCommentButton = ({
  commentId,
  postId,
}: {
  commentId: string;
  postId: string;
}) => {
  const handleDeleteComment = async (commentId: string) => {
    await client
      .patch(postId)
      .unset([`comment[_ref=="${commentId}"]`])
      .commit();
    await client.delete(commentId);
  };
  return (
    <Button
      variant={"destructive"}
      className="cursor-pointer hover:bg-red-500"
      onClick={() => handleDeleteComment(commentId)}
    >
      <Trash className="size-4" />
    </Button>
  );
};

export default DeleteCommentButton;
