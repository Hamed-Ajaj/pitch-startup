import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import React from "react";

const StartupPostDetails = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { postId });

  if (!post) return notFound();
  console.log(post);
  return (
    <div>
      <h1>{post.title}</h1>
    </div>
  );
};

export default StartupPostDetails;
