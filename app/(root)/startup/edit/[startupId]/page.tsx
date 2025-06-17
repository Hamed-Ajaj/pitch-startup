import StartupForm from "@/components/startup-form";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";

async function EditStartup({ params }: { params: Promise<{ startupId: string }> }) {
  const { startupId } = await params;
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { postId: startupId })
  console.log(post)
  return (
    <div>
      <section className="pink_container !min-h-[230px] pattern">
        <h1 className="heading">Edit Your Startup</h1>
      </section>
      <StartupForm post={post} />
    </div>
  )
}
export default EditStartup;
