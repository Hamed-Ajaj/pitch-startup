import StartupForm from "@/components/startup-form";
import React from "react";

const CreateStartup = () => {
  // const session = await auth();

  // if (!session) redirect("/");
  return (
    <>
      <section className="pink_container !min-h-[230px] pattern">
        <h1 className="heading">Submit your Startup</h1>
      </section>
      <StartupForm />
    </>
  );
};

export default CreateStartup;
