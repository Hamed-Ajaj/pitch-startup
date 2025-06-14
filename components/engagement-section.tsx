import React from "react";
import UpvoteDownvoteButtons from "./ui/upvote-downvote-btn";
import { client } from "@/sanity/lib/client";
import {
  COMMENTS_COUNT_QUERY,
  DOWNVOTES_QUERY,
  UPVOTES_QUERY,
} from "@/sanity/lib/queries";
import { MessageCircle } from "lucide-react";

const EngagementSection = async ({ post }) => {
  const [upvotes, downvotes, commentsCount] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch(UPVOTES_QUERY, { id: post._id }),
    client
      .withConfig({ useCdn: false })
      .fetch(DOWNVOTES_QUERY, { id: post._id }),
    client.withConfig({ useCdn: false }).fetch(COMMENTS_COUNT_QUERY, {
      id: post?._id,
    }),
  ]);

  return (
    <section className="section_container flex justify-between items-center ">
      <UpvoteDownvoteButtons
        postId={post._id}
        upvotes={upvotes}
        downvotes={downvotes}
      />
      {/* comments */}
      <div className="flex gap-2 items-center">
        <MessageCircle />
        {commentsCount.length || 0}
      </div>
    </section>
  );
};

export default EngagementSection;
