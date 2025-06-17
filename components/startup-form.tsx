"use client";
import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validations";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import { Startup } from "@/sanity.types";
const StartupForm = ({ post }: { post?: Startup }) => {
  const [error, setError] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState<string>("");
  const router = useRouter();
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: formData.get("category")?.toString() || "",
        image: formData.get("image")?.toString() || "",
        picture: formData.get("picture") || "",
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status == "SUCCESS") {
        toast.success("Success", {
          description: "Your startup pitch has been created successfully",
        });

        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErorrs = error.flatten().fieldErrors;

        setError(fieldErorrs as unknown as Record<string, string>);

        toast.error("error", {
          description: "Please check your inputs and try again",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("Error", {
        description: "An unexpected error has occurred",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });
  return (
    <form action={formAction} className="startup-form">
      {/* title */}
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={post?.title}
          className="startup-form_input"
          placeholder="Startup Title"
        />
        {error.title && <p className="startup-form_error">{error.title}</p>}
      </div>
      {/* description */}
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          defaultValue={post?.description}
          placeholder="Startup Description"
        />
        {error.description && (
          <p className="startup-form_error">{error.description}</p>
        )}
      </div>
      {/* category */}
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          required
          defaultValue={post?.category}
          className="startup-form_input"
          placeholder="Startup Category"
        />
        {error.category && (
          <p className="startup-form_error">{error.category}</p>
        )}
      </div>
      {/* image */}
      <div>
        <label htmlFor="image" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="image"
          name="image"
          required
          defaultValue={post?.image}
          className="startup-form_input"
          placeholder="Startup Image URL"
        />
        {error.image && <p className="startup-form_error">{error.image}</p>}
      </div>

      {/* pictur */}
      {/* <div> */}
      {/*   <label className="startup-form_label" htmlFor="picture"> */}
      {/*     Picture */}
      {/*   </label> */}
      {/*   <Input */}
      {/*     id="picture" */}
      {/*     type="file" */}
      {/*     name="picture" */}
      {/*     required */}
      {/*     className="py-2 border-3 border-black" */}
      {/*   /> */}
      {/* </div> */}

      {/* markdown */}
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          value={post?.pitch || pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {error.pitch && <p className="startup-form_error">{error.pitch}</p>}
      </div>
      <Button
        type="submit"
        className="startup-form_btn text-white cursor-pointer"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
