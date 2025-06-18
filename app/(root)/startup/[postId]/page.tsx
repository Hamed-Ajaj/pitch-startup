import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  ALL_ENGAGEMENTS_QUERY,
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
import EngagementSection from "@/components/engagement-section";
import EngagementSkeleton from "@/components/ui/engagement-skeleton";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Edit, Flag, MessageCircle, MoreHorizontal, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const engagements = await client
    .withConfig({ useCdn: false })
    .fetch(ALL_ENGAGEMENTS_QUERY, {
      id: post._id,
    });

  const parsedContent = md.render(post?.pitch || "");
  if (!post) return notFound();
  return (
    <>
      <section className="pink_container pattern !min-h-[230px]">
        <p className="tag tag-tri"> {formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post?.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>

      {/* engagements */}
      <Suspense fallback={<EngagementSkeleton />}>
        <EngagementSection post={post} />
      </Suspense>

      <hr className="divider !max-w-6xl !my-4" />

      <section className="section_container">
        <div className="max-w-4xl mx-auto">
          <Image
            src={post.image}
            alt="thumbnail"
            width={720}
            height={720}
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl object-cover"
          />

          <div className="space-y-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href={`/user/${post?.author?._id}`}
                className="flex gap-3 items-center"
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
                  <p className="text-16-medium text-gray-600">
                    @{post?.author?.username}
                  </p>
                </div>
              </Link>
              <p className="category-tag self-start sm:self-center">
                {post?.category}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-30-bold">Pitch Details</h3>
              {parsedContent ? (
                <article
                  dangerouslySetInnerHTML={{ __html: parsedContent }}
                  className="prose prose-lg max-w-none font-work-sans break-words"
                ></article>
              ) : (
                <p className="no-result">No details provided</p>
              )}
            </div>
          </div>
        </div>
        <hr className="divider" />

        {/* Editor selected startups */}
        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <p className="text-30-semibold mb-6">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}
        {/* comments */}
        <section className="max-w-4xl mx-auto mt-12">
          {/* comment number */}
          <h3 className="text-30-semibold mb-6">
            Comments ({comments?.length || 0})
          </h3>

          {/* comment form */}
          <div className="mb-8">
            <AddCommentForm postId={post?._id} sessionId={session?.id} />
          </div>

          {/* comments list */}
          <div className="space-y-4">
            {comments?.length > 0 &&
              comments.map((comment) => (
                <div
                  key={comment?._id}
                  className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <Image
                      src={comment.author?.image || "/default-avatar.png"}
                      alt={comment.author?.name || "Comment Author"}
                      width={48}
                      height={48}
                      className="rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <div>
                          <p className="text-16-medium">
                            {comment.author?.name}
                          </p>
                          <p className="text-14 text-gray-500">
                            {formatDate(comment._createdAt)}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="w-48 bg-gray-50 p-2 rounded-md border border-default" align="end" sideOffset={5}>
                            {/* <DropdownMenuItem className="gap-2 cursor-pointer"> */}
                            {/*   <MessageCircle className="w-4 h-4" /> */}
                            {/*   Reply */}
                            {/* </DropdownMenuItem> */}

                            <DropdownMenuItem asChild>
                              <Link
                                href={`/user/${comment.author._id}`}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <User className="w-4 h-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>

                            {/* <DropdownMenuSeparator /> */}
                            {/**/}
                            {/* <DropdownMenuItem className="gap-2 cursor-pointer"> */}
                            {/*   <Flag className="w-4 h-4" /> */}
                            {/*   Report */}
                            {/* </DropdownMenuItem> */}
                            {/**/}
                            {comment.author._id === session?.id && (
                              <>
                                {/* <DropdownMenuSeparator /> */}
                                {/* <DropdownMenuItem className="gap-2 cursor-pointer"> */}
                                {/*   <Edit className="w-4 h-4" /> */}
                                {/*   Edit */}
                                {/* </DropdownMenuItem> */}
                                <DeleteCommentButton commentId={comment._id} />
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-16 leading-relaxed break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* views  */}
        <div className="max-w-4xl mx-auto mt-8">
          <Suspense fallback={<Skeleton className="view-skeleton" />}>
            <View id={post?._id} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default StartupPostDetails;
