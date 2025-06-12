"use client";
import React, { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { createComment } from "@/lib/actions";
import { toast } from "sonner";

const AddCommentForm = ({
  postId,
  sessionId,
}: {
  postId: string;
  sessionId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const handleCreateComment = async (formData: FormData) => {
    if (!sessionId)
      return toast.error(`User Not Authenticated`, {
        description: "Please Login to Add a Comment",
      });
    const comment = formData.get("content") as string;
    if (!comment || comment.trim() === "") {
      return {
        error: "Comment cannot be empty",
        status: "ERROR",
      };
    }

    startTransition(async () => {
      try {
        const result = await createComment(postId, comment);

        return toast.success("Comment added Successfully");
      } catch (error) {
        return toast.error(`Error : ${error}`);
      }
    });
  };

  return (
    <div className="bg-white p-5 my-5 rounded-lg shadow-md">
      <h4 className="text-20-medium mb-3">Leave a Comment</h4>
      <p className="text-16 text-gray-500 mb-5">
        Share your thoughts about this startup.
      </p>
      <form action={handleCreateComment}>
        <textarea
          className="w-full p-3 border rounded-lg"
          rows={4}
          placeholder="Write your comment here..."
          name="content"
          required
          maxLength={500}
        ></textarea>
        <Button
          type="submit"
          className="startup-form_btn text-white cursor-pointer mt-5"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Comment"}
        </Button>
      </form>
    </div>
  );
};

export default AddCommentForm;
