import SearchForm from "@/components/search-form";
import StartupCard from "@/components/startup-card";
import { Post } from "@/types/post";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;
  const posts: Post[] = [
    {
      _createdAt: new Date(),
      views: 55,
      author: { _id: 1, name: "H4m3d" },
      _id: 1,
      description: "This is a Description",
      image:
        "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Projects",
      title: "My Project",
    },
    {
      _createdAt: new Date(),
      views: 55,
      author: { _id: 1, name: "Hamed" },
      _id: 2,
      description: "This is a Description",
      image:
        "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Projects",
      title: "My Project",
    },
    {
      _createdAt: new Date(),
      views: 55,
      author: { _id: 1, name: "Linux_King" },
      _id: 3,
      description: "This is a Description",
      image:
        "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Projects",
      title: "My Project",
    },
  ];
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
        <ul className="mt-7 card_grid">
          {posts.length > 0 ? (
            posts.map((post: Post) => (
              <StartupCard post={post} key={post?._id} />
            ))
          ) : (
            <p className="no-results">No Startup Found</p>
          )}
        </ul>
      </section>
    </>
  );
}
