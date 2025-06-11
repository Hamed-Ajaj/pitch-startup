"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react"; // Adjust based on your auth
import { toggleLike } from "@/lib/actions";
import { toast } from "sonner";

interface LikeButtonProps {
  startupId: string;
  initialLikes: number;
  initialLikedBy: string[];
  className?: string;
}

const LikeButton = ({
  startupId,
  initialLikes,
  initialLikedBy,
  className = "",
}: LikeButtonProps) => {
  const { data: session } = useSession();
  const userId = session?.id;

  const [likes, setLikes] = useState(initialLikes || 0);
  const [likedBy, setLikedBy] = useState(initialLikedBy || []);
  const [isPending, startTransition] = useTransition();

  if (!userId) {
    return <>loading...</>;
  }
  const isLiked = likedBy.includes(userId);

  const handleLike = () => {
    if (!userId) {
      // Redirect to login or show login modal

      return toast.error("Please log in to like this startup.");
    }

    // Optimistic update
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setLikedBy((prev) => prev.filter((id) => id !== userId));
    } else {
      setLikes((prev) => prev + 1);
      setLikedBy((prev) => [...prev, userId]);
    }

    // Server action
    startTransition(async () => {
      try {
        const result = await toggleLike(startupId, userId);
        console.log("result", result);
        if (result.success) {
          setLikes(result.likes);
          setLikedBy(result.likedBy);
        } else {
          // Revert optimistic update on error
          if (isLiked) {
            setLikes((prev) => prev + 1);
            setLikedBy((prev) => [...prev, userId]);
          } else {
            setLikes((prev) => prev - 1);
            setLikedBy((prev) => prev.filter((id) => id !== userId));
          }
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        // Revert optimistic update
        if (isLiked) {
          setLikes((prev) => prev + 1);
          setLikedBy((prev) => [...prev, userId]);
        } else {
          setLikes((prev) => prev - 1);
          setLikedBy((prev) => prev.filter((id) => id !== userId));
        }
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
        isLiked
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600"
      } ${isPending ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} ${className}`}
    >
      <Heart
        size={16}
        className={`transition-all duration-200 ${
          isLiked ? "fill-red-500 text-red-500" : ""
        }`}
      />
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
};

export default LikeButton;
