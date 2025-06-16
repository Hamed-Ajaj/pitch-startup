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
      weak: true,
    }),
    defineField({
      name: "startup",
      type: "reference",
      weak: true,
      to: { type: "startup" },
      validation: (Rule) =>
        Rule.required().error("Startup reference is required"),
    }),
  ],
};
