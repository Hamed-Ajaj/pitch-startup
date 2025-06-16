import { formatDate } from "@/lib/utils";
import {
  ArrowBigDown,
  ArrowBigUp,
  Eye,
  MessageCircle,
  Calendar,
  User,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Author, Startup } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import {
  ALL_ENGAGEMENTS_QUERY,
  COMMENTS_COUNT_QUERY,
  DOWNVOTES_QUERY,
  UPVOTES_QUERY,
} from "@/sanity/lib/queries";
import DeleteStartupButton from "./ui/delete-startup-btn";

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

const StartupCard = async ({
  post,
  isAuthor = false,
}: {
  post: StartupTypeCard;
  isAuthor: boolean;
}) => {
  const commentsCount = await client.fetch(COMMENTS_COUNT_QUERY, {
    id: post?._id,
  });
  const upvotes = await client.fetch(UPVOTES_QUERY, {
    id: post?._id,
  });
  const downvotes = await client.fetch(DOWNVOTES_QUERY, {
    id: post?._id,
  });

  if (!commentsCount)
    return (
      <div className="startup-card animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );

  return (
    <li className="group relative h-full">
      <div className="startup-card bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden backdrop-blur-sm h-full flex flex-col">
        {/* Gradient overlay for modern look */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-4">
            {/* Date with improved styling */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              <Calendar className="size-4" />
              <span className="font-medium">
                {formatDate(post?._createdAt)}
              </span>
            </div>

            {/* Views with improved styling */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
              <Eye className="size-4 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-700 dark:text-green-300">
                {post?.views?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Author Section with improved layout */}
          <div className="flex items-start gap-4 mb-4">
            <Link
              href={`/user/${post?.author?._id}`}
              className="relative group/avatar"
            >
              <div className="relative overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-700 group-hover/avatar:ring-blue-500 transition-all duration-200">
                <Image
                  src={post?.author?.image}
                  alt={post?.author?.name || "Author"}
                  width={56}
                  height={56}
                  className="rounded-full object-cover group-hover/avatar:scale-110 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200" />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                href={`/user/${post?.author?._id}`}
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-1"
              >
                <User className="size-4" />
                <span className="font-medium truncate">
                  {post?.author?.name}
                </span>
              </Link>

              <Link href={`/startup/${post?._id}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight">
                  {post?.title}
                </h3>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <Link
            href={`/startup/${post?._id}`}
            className="relative flex-1 flex flex-col"
          >
            {/* Description */}
            <div className="px-6 pb-4 flex-1">
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm leading-relaxed">
                {post?.description}
              </p>
            </div>

            {/* Image with improved styling */}
            <div className="relative overflow-hidden mx-6 mb-6 rounded-xl group-hover:rounded-lg transition-all duration-300">
              <Image
                src={post?.picture ? post.picture : post.image}
                alt={post?.title || "Startup image"}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                width={400}
                height={200}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Trending indicator */}
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-2">
                <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Section */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center">
            {/* Category Tag */}
            <Link
              href={`/?query=${post?.category?.toLowerCase()}`}
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              {post?.category}
            </Link>

            {/* Engagement Stats */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {/* Upvotes */}
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 group/stat">
                <div className="p-1.5 rounded-full bg-green-50 dark:bg-green-900/20 group-hover/stat:bg-green-100 dark:group-hover/stat:bg-green-900/40 transition-colors duration-200">
                  <ArrowBigUp className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-semibold">{upvotes.length}</span>
              </div>

              {/* Downvotes */}
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 group/stat">
                <div className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/20 group-hover/stat:bg-red-100 dark:group-hover/stat:bg-red-900/40 transition-colors duration-200">
                  <ArrowBigDown className="size-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-semibold">
                  {downvotes.length}
                </span>
              </div>

              {/* Comments */}
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group/stat">
                <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover/stat:bg-blue-100 dark:group-hover/stat:bg-blue-900/40 transition-colors duration-200">
                  <MessageCircle className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-semibold">
                  {commentsCount.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAuthor && (
        <div className="absolute hidden transition group-hover:block -top-3 -right-3 z-10">
          <DeleteStartupButton startupId={post._id} />
        </div>
      )}
    </li>
  );
};

export default StartupCard;
