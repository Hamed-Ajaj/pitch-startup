"use server";

import { auth } from "@/auth";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionRes } from "./utils";
import { revalidatePath } from "next/cache";
import { client } from "@/sanity/lib/client";
import {
  ALL_ENGAGEMENTS_QUERY,
  DOWNVOTES_QUERY,
  UPVOTES_QUERY,
} from "@/sanity/lib/queries";

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

  const { title, description, category, image, picture } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch"),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: image,
      picture: picture,
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


export const editStartup = async (state: any,
  form: FormData,
  pitch: string,
  startupId: string,
) => {
  const session = await auth();

  if (!session)
    return parseServerActionRes({
      error: "Not signed in",
      status: "ERROR",
    });

  const { title, description, category, image, picture } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch"),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  // try {
  //   const startup = {
  //     title,
  //     description,
  //     category,
  //     image: image,
  //     picture: picture,
  //     slug: {
  //       _type: slug,
  //       current: slug,
  //     },
  //     pitch,
  //   };
  //   const editStartup = await writeClient.patch(startupId).set({
  //
  //   })
  // }
}
export const deleteStartup = async (startupId: string) => {
  const session = await auth();
  if (!session)
    return parseServerActionRes({
      error: "Not signed in",
      status: "ERROR",
    });

  try {
    const engagements = await client
      .withConfig({ useCdn: false })
      .fetch(ALL_ENGAGEMENTS_QUERY, {
        id: startupId,
      });
    if (engagements)
      for (const docId of engagements) {
        await writeClient.withConfig({ useCdn: false }).delete(docId._id);
      }

    const result = await writeClient
      .withConfig({ useCdn: false })
      .delete(startupId);

    revalidatePath(`/user`);
    revalidatePath("/");
    return parseServerActionRes({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error: unknown) {
    return parseServerActionRes({
      error: "Failed to delete Startup",
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
    const createdComment = await writeClient
      .withConfig({ useCdn: false })
      .create({
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

// Delete Comment
export const deleteComment = async (commentId: string) => {
  try {
    const deletedComment = await writeClient
      .withConfig({ useCdn: false })
      .delete(commentId);

    revalidatePath(`/startup`);
    revalidatePath("/");
    return parseServerActionRes({
      ...deletedComment,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return parseServerActionRes({
      error: "Failed to delete comment",
      status: "ERROR",
    });
  }
};

export const upvote = async (startupId: string) => {
  const session = await auth();

  if (!session?.id) {
    throw new Error("User not authenticated");
  }

  const upvotes = await client
    .withConfig({ useCdn: false })
    .fetch(UPVOTES_QUERY, { id: startupId });

  try {
    const existingUpvote = upvotes.find(
      (vote: any) => vote.author._ref === session.id,
    );

    if (existingUpvote) {
      await writeClient
        .withConfig({ useCdn: false })
        .delete(existingUpvote._id);

      revalidatePath(`/startup/${startupId}`);
      revalidatePath("/");

      return parseServerActionRes({
        status: "SUCCESS",
        message: "Upvote removed",
      });
    }

    const upvote = await writeClient.withConfig({ useCdn: false }).create({
      _type: "upvote",
      author: {
        _type: "reference",
        _ref: session.id,
      },
      startup: {
        _type: "reference",
        _ref: startupId,
      },
    });

    revalidatePath(`/startup/${startupId}`);
    revalidatePath("/");

    return parseServerActionRes({
      status: "SUCCESS",
      upvote,
    });
  } catch (error) {
    console.error("Error toggling upvote:", error);
    return parseServerActionRes({
      status: "ERROR",
      error: "Failed to toggle upvote",
    });
  }
};

export const downvote = async (startupId: string) => {
  const session = await auth();

  if (!session?.id) {
    throw new Error("User not authenticated");
  }

  const downvotes = await client
    .withConfig({ useCdn: false })
    .fetch(DOWNVOTES_QUERY, { id: startupId });

  try {
    const existingDownvote = downvotes.find(
      (vote: any) => vote.author._ref === session.id,
    );

    if (existingDownvote) {
      await writeClient
        .withConfig({ useCdn: false })
        .delete(existingDownvote._id);

      revalidatePath(`/startup/${startupId}`);
      revalidatePath("/");

      return parseServerActionRes({
        status: "SUCCESS",
        message: "Downvote removed",
      });
    }

    const downvote = await writeClient.withConfig({ useCdn: false }).create({
      _type: "downvote",
      author: {
        _type: "reference",
        _ref: session.id,
      },
      startup: {
        _type: "reference",
        _ref: startupId,
      },
    });

    revalidatePath(`/startup/${startupId}`);
    revalidatePath("/");

    return parseServerActionRes({
      status: "SUCCESS",
      downvote,
    });
  } catch (error) {
    console.error("Error toggling downvote:", error);
    return parseServerActionRes({
      status: "ERROR",
      error: "Failed to toggle downvote",
    });
  }
};
