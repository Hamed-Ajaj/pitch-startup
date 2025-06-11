import AllStartups from "@/components/all-startups";
import SearchForm from "@/components/search-form";
import StartupCardSkeleton from "@/components/ui/startup-card-skeleton";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  return (
    <>
      <section className="pink_container pattern">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect with Entrepreneurs
        </h1>
        <p className="sub-heading max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <Suspense fallback={<StartupCardSkeleton />}>
          <AllStartups params={params} />
        </Suspense>
      </section>
    </>
  );
}
