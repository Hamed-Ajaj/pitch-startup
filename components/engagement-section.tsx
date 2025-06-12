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
  const upvotes = await client
    .withConfig({ useCdn: false })
    .fetch(UPVOTES_QUERY, { id: post._id });
  const downvotes = await client
    .withConfig({ useCdn: false })
    .fetch(DOWNVOTES_QUERY, { id: post._id });
  const commentsCount = await client
    .withConfig({ useCdn: false })
    .fetch(COMMENTS_COUNT_QUERY, {
      id: post?._id,
    });
  console.log(commentsCount);
  console.log(post._id);
  console.log(upvotes);
  return (
    <section className="section_container flex justify-between items-center ">
      <UpvoteDownvoteButtons
        postId={post._id}
        upvotes={upvotes}
        upvotedBy={post?.upvotedBy}
        downvotes={downvotes}
        downvotedBy={post?.downvotedBy}
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
