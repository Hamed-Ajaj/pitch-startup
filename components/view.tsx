import React from "react";
import Ping from "./ui/ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";

const View = async ({ id }: { id: string }) => {
  // Get current user session
  const session = await auth();
  const userId = session?.id;

  // Fetch current views and viewedBy array
  const { views, viewedBy } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  // Check if current user has already viewed this startup
  const hasUserViewed = userId && viewedBy?.includes(userId) ? true : false;
  // Only increment view count if user hasn't viewed before
  if (userId && !hasUserViewed) {
    after(async () => {
      await writeClient
        .patch(id)
        .set({
          views: (views || 0) + 1,
          viewedBy: [...(viewedBy || []), userId],
        })
        .commit();
    });
  }

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">Views: {views || 0}</span>
      </p>
    </div>
  );
};

export default View;
