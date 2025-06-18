"use client";
import React, { useState, useTransition } from "react";
import { Button } from "./button";
import { Loader, Trash, Trash2 } from "lucide-react";
import { deleteComment } from "@/lib/actions";
import { toast } from "sonner";
import { DropdownMenuItem } from "./dropdown-menu";

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
    <div onClick={handleDeleteComment} className="">

      <DropdownMenuItem
        className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"

      >
        <Trash2 className="w-4 h-4" />

        {isDeleting ? (
          <p>Deleting...</p>
        ) : (
          <p>Delete</p>
        )}

      </DropdownMenuItem>



    </div>

  );
};

export default DeleteCommentButton;
