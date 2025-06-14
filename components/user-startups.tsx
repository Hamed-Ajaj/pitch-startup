import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import React from "react";
import StartupCard, { StartupTypeCard } from "./startup-card";

const UserStartups = async ({ id }: { id: string }) => {
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });
  return (
    <>
      {startups.length > 0 ? (
        startups?.map((startup: StartupTypeCard) => (
          <StartupCard key={startup._id} post={startup} />
        ))
      ) : (
        <p className="no-results">No Posts Yet</p>
      )}
    </>
  );
};

export default UserStartups;
