"use client";
import React, { useState, useTransition } from "react";
import { Button } from "./button";
import { Loader, Trash } from "lucide-react";
import { deleteComment } from "@/lib/actions";
import { toast } from "sonner";

const DeleteCommentButton = ({ commentId }: { commentId: string }) => {
  // const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteComment = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteComment(commentId);
      setIsDeleting(false);
      return toast.success("Comment has Been deleted Successfully");
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      className="cursor-pointer hover:bg-red-500"
      onClick={handleDeleteComment}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader className="animate-spin" />
      ) : (
        <Trash className="size-4" />
      )}
    </Button>
  );
};

export default DeleteCommentButton;
