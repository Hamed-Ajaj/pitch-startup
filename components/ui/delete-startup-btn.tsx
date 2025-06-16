"use client";
import React, { useActionState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Button } from "./button";
import { Loader, Trash } from "lucide-react";
import { deleteStartup } from "@/lib/actions";
import { toast } from "sonner";

const DeleteStartupButton = ({ startupId }: { startupId: string }) => {
  const handleDeleteStartup = async () => {
    try {
      const res = await deleteStartup(startupId);
      if (res.status == "SUCCESS") {
        toast.success("Success", {
          description: "Your startup has been deleted successfully",
        });
      }
      return res;
    } catch (error) {
      return toast.error("Something went wrong");
    }
  };

  const [state, formAction, isPending] = useActionState(handleDeleteStartup, {
    status: "INITAL",
    error: "",
  });
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <form action={formAction}>
          <Button className=" rounded-full cursor-pointer" type="submit">
            {isPending ? <Loader className="animate-spin" /> : <Trash />}
          </Button>
        </form>
      </TooltipTrigger>
      <TooltipContent>Delete Post</TooltipContent>
    </Tooltip>
  );
};

export default DeleteStartupButton;
