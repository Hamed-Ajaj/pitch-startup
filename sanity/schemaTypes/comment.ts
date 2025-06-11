import { defineField } from "sanity";

export const comment = {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "authorId",
      type: "string",
      description: "ID of the user who authored this comment",
      validation: (Rule) => Rule.required().error("Author ID is required"),
    }),
    defineField({
      name: "content",
      type: "text",
      validation: (Rule) =>
        Rule.min(1)
          .max(500)
          .required()
          .error("Content must be between 1 and 500 characters"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "content",
      },
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
