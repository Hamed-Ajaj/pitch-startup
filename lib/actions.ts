"use server";

import { auth } from "@/auth";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionRes } from "./utils";
import { revalidatePath } from "next/cache";
import { client } from "@/sanity/lib/client";
import { author } from "@/sanity/schemaTypes/author";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string,
) => {
  const session = await auth();

  if (!session)
    return parseServerActionRes({
      error: "Not signed in",
      status: "ERROR",
    });

  const { title, description, category, image } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch"),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: image,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...startup });

    return parseServerActionRes({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionRes({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const createComment = async (startupId: string, comment: string) => {
  const session = await auth();

  if (!session)
    return parseServerActionRes({
      error: "Not signed in",
      status: "ERROR",
    });
  if (!comment || comment.trim() === "")
    return parseServerActionRes({
      error: "Comment cannot be empty",
      status: "ERROR",
    });

  try {
    const newComment = {
      content: comment,
      slug: {
        _type: "slug",
        current: slugify(comment, { lower: true, strict: true }),
      },
      author: {
        _type: "reference",
        _ref: session.id,
      },
      authorId: session.id,
      startup: {
        _type: "reference",
        _ref: startupId,
      },
    };
    const createdComment = await writeClient.create({
      _type: "comment",
      ...newComment,
    });
    revalidatePath(`/startup`);
    revalidatePath("/");
    return parseServerActionRes({
      ...createdComment,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return parseServerActionRes({
      error: "Failed to create comment",
      status: "ERROR",
    });
  }
};

// Toggle like action
export async function toggleLike(startupId: string, userId: string) {
  try {
    // Fetch current like data
    const startup = await client.fetch(
      `*[_type == "startup" && _id == $id][0]{ _id, likes, likedBy }`,
      { id: startupId },
    );

    if (!startup) {
      return { success: false, error: "Startup not found" };
    }

    const currentLikes = startup.likes || 0;
    const currentLikedBy = startup.likedBy || [];
    const isLiked = currentLikedBy.includes(userId);

    let newLikes: number;
    let newLikedBy: string[];

    if (isLiked) {
      // Unlike
      newLikes = Math.max(0, currentLikes - 1);
      newLikedBy = currentLikedBy.filter((id: string) => id !== userId);
    } else {
      // Like
      newLikes = currentLikes + 1;
      newLikedBy = [...currentLikedBy, userId];
    }

    // Update in Sanity
    await writeClient
      .patch(startupId)
      .set({
        likes: newLikes,
        likedBy: newLikedBy,
      })
      .commit();

    // Revalidate pages that might show this data
    revalidatePath("/");
    revalidatePath(`/startup/${startupId}`);

    return {
      success: true,
      likes: newLikes,
      likedBy: newLikedBy,
      isLiked: !isLiked,
    };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}
