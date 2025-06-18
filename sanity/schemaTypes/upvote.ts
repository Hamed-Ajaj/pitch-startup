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
      weak: true,
    }),
    defineField({
      name: "startup",
      type: "reference",
      to: { type: "startup" },
      weak: true,
      validation: (Rule) =>
        Rule.required().error("Startup reference is required"),
    }),
  ],
};
