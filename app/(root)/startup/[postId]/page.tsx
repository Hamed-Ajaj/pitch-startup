import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  COMMENTS_QUERY,
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
  STARTUP_COMMENTS_QUERY,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/view";
import StartupCard, { StartupTypeCard } from "@/components/startup-card";
import AddCommentForm from "@/components/add-comment-form";
import DeleteCommentButton from "@/components/ui/delete-comment-btn";
import { auth } from "@/auth";
const md = markdownit();

const StartupPostDetails = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;
  const session = await auth();
  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { postId }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" }),
  ]);

  const comments = await client
    .withConfig({ useCdn: false })
    .fetch(COMMENTS_QUERY, { id: postId });

  const parsedContent = md.render(post?.pitch || "");
  if (!post) return notFound();
  console.log(comments);
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
        {/* comments */}
        <section className="max-w-4xl mx-auto flex flex-col gap-5">
          {/* comment number */}
          <h3 className="text-30-semibold  mt-10">
            Comments ({comments?.length || 0})
          </h3>

          {/* comment form */}
          <AddCommentForm postId={post?._id} />

          {/* comments list */}
          {comments?.length > 0 &&
            comments.map((comment) => (
              <div
                key={comment?._id}
                className="max-w-4xl  mb-3 rounded-lg bg-white p-5 shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={comment.author?.image || "/default-avatar.png"}
                    alt={comment.author?.name || "Comment Author"}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <p className="text-16-medium">{comment.author?.name}</p>
                      <p className="text-14 text-gray-500">
                        {formatDate(comment._createdAt)}
                      </p>
                    </div>
                    <div>
                      {comment.author._id === session?.id && (
                        <DeleteCommentButton
                          commentId={comment._id}
                          postId={postId}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-16">{comment.content}</p>
              </div>
            ))}
        </section>

        {/* views  */}
        <Suspense fallback={<Skeleton className="view-skeleton" />}>
          <View id={post?._id} />
        </Suspense>
      </section>
    </>
  );
};

export default StartupPostDetails;
