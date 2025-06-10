import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/view";
import StartupCard, { StartupTypeCard } from "@/components/startup-card";
const md = markdownit();

const StartupPostDetails = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;
  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { postId }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" }),
  ]);
  const parsedContent = md.render(post?.pitch || "");
  if (!post) return notFound();
  return (
    <>
      <section className="pink_container pattern !min-h-[230px]">
        <p className="tag tag-tri"> {formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post?.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>
      <section className="section_container">
        <Image
          src={post?.image}
          alt="thumbnail"
          className="w-full h-[600px] rounded-xl object-bottom object-cover"
          width={720}
          height={520}
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
        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view-skeleton" />}>
          <View id={post?._id} />
        </Suspense>
      </section>
    </>
  );
};

export default StartupPostDetails;
