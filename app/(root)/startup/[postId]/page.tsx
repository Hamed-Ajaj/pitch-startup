import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/view";
const md = markdownit();

const StartupPostDetails = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { postId });
  const parsedContent = md.render(post?.pitch || "");
  // const parsedContent = md.render("```this is idk```");
  console.log(parsedContent);
  if (!post) return notFound();
  return (
    <>
      <section className="pink_container pattern !min-h-[230px]">
        <p className="tag tag-tri"> {formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post?.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>
      <section className="section_container">
        <img
          src={post?.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl max-h-[580px] object-cover"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post?.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post?.author?.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post?.author?.name}</p>
                <p className="text-16-medium">@{post?.author?.username}</p>
              </div>
            </Link>
            <p className="category-tag">{post?.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              dangerouslySetInnerHTML={{ __html: parsedContent }}
              className="prose max-w-4xl font-work-sans break-all"
            ></article>
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />

        {/* Editor selected startups */}

        <Suspense fallback={<Skeleton className="view-skeleton" />}>
          <View id={post?._id} />
        </Suspense>
      </section>
    </>
  );
};

export default StartupPostDetails;
