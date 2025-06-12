import { defineField } from "sanity";

export const downvote = {
  name: "downvote",
  title: "Downvote",
  type: "document",
  fields: [
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "startup",
      type: "reference",
      to: { type: "startup" },
      validation: (Rule) =>
        Rule.required().error("Startup reference is required"),
    }),
  ],
};
