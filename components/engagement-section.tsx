import React from "react";
import UpvoteDownvoteButtons from "./ui/upvote-downvote-btn";
import { client } from "@/sanity/lib/client";
import {
  COMMENTS_COUNT_QUERY,
  DOWNVOTES_QUERY,
  UPVOTES_QUERY,
} from "@/sanity/lib/queries";
import { Edit, MessageCircle } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

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

  const session = await auth();
  return (
    <section className="section_container flex justify-between items-center ">
      <UpvoteDownvoteButtons
        postId={post._id}
        upvotes={upvotes}
        downvotes={downvotes}
      />
      <div className="flex gap-6 items-center">
        {
          session?.id === post.author._id && (<Link href={`/startup/edit/${post._id}`}>
            <Edit />
          </Link>
          )
        }

        {/* comments */}
        <div className="flex gap-2 items-center">
          <MessageCircle />
          {commentsCount.length || 0}
        </div>

      </div>
    </section>
  );
};

export default EngagementSection;
