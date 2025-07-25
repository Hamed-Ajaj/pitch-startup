import { auth } from "@/auth";
import StartupCardSkeleton from "@/components/ui/startup-card-skeleton";
import UserStartups from "@/components/user-startups";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import React, { Suspense } from "react";

const ComponentName = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id: userId });

  if (!user) return <div>User not found</div>;
  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.id === userId ? "Your" : "All"} Startups
          </p>
          <Suspense fallback={<StartupCardSkeleton />}>
            <ul className="card_grid-sm">
              <UserStartups id={userId} />
            </ul>
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default ComponentName;
