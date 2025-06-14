import { defineField } from "sanity";

export const upvote = {
  name: "upvote",
  title: "Upvote",
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
