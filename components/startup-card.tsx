import { formatDate } from "@/lib/utils";
import { Eye, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Author, Startup } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { COMMENTS_COUNT_QUERY } from "@/sanity/lib/queries";

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

const StartupCard = async ({ post }: { post: StartupTypeCard }) => {
  console.log("StartupCard post", post._id);
  const commentsCount = await client.fetch(COMMENTS_COUNT_QUERY, {
    id: post?._id,
  });
  // console.log(commentsCount);
  if (!commentsCount) return <>loading...</>;
  return (
    <li className="startup-card group">
      {/* top card section */}
      <div className="flex-between">
        {/* date */}
        <div className="startup-card_date">{formatDate(post?._createdAt)}</div>
        {/* views */}
        <div className="flex gap-1 items-center">
          <Eye className="size-5 text-default" /> <span>{post?.views}</span>
        </div>
      </div>

      {/* Author Info */}
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${post?.author?._id}`}>
            <p className="line-clamp-1 text-16-medium">{post?.author?.name}</p>
          </Link>
          <Link href={`/startup/${post?._id}`}>
            <h3 className="text-26-semibold line-clamp-1">{post?.title}</h3>
          </Link>
        </div>
        <Link href={`/user/${post?.author?._id}`}>
          <Image
            src={post?.author?.image}
            alt={post?.author?.image}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>
      <Link href={`/startup/${post?._id}`}>
        <p className="startup-card_desc">{post?.description}</p>
        <Image
          src={post?.image}
          alt="post image"
          className="startup-card_img"
          width={200}
          height={200}
        />
      </Link>
      <div className="flex justify-between items-center  gap-3 mt-5">
        <Link href={`/?query=${post?.category?.toLowerCase()}`}>
          {post?.category}
        </Link>
        {/* <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${post?._id}`}>Details</Link>
        </Button> */}
        {/* <LikeButton
          startupId={post._id}
          initialLikedBy={post?.likedBy}
          initialLikes={post?.likes}
          /> */}
        <p className="flex items-center gap-1 text-default">
          {commentsCount.length} <MessageCircle />
        </p>
      </div>
    </li>
  );
};

export default StartupCard;
