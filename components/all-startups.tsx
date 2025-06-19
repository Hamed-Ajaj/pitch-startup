import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import React from "react";
import StartupCard, { StartupTypeCard } from "./startup-card";

const AllStartups = async ({ params }) => {
  const posts = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUPS_QUERY, params, {
      next: { revalidate: 10 },
    });

  console.log("All Startups:", posts);

  return (
    <ul className="mt-7 card_grid ">
      {posts.length > 0 ? (
        posts.map((post: StartupTypeCard) => (
          <StartupCard post={post} key={post?._id} />
        ))
      ) : (
        <p className="no-results !w-full">No Startup Found</p>
      )}
    </ul>
  );
};

export default AllStartups;
