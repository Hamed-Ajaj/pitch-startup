import { defineField } from "sanity";

export const startup = {
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
      initialValue: 0,
    }),
    // Add field to track which users have viewed this startup
    defineField({
      name: "viewedBy",
      title: "Viewed By Users",
      type: "array",
      of: [{ type: "string" }],
      description: "Array of user IDs who have viewed this startup",
      hidden: true, // Hide from studio UI
    }),
    // Alternative: Track by session IDs (if no user auth)
    defineField({
      name: "viewedBySessions",
      title: "Viewed By Sessions",
      type: "array",
      of: [{ type: "string" }],
      description: "Array of session IDs who have viewed this startup",
      hidden: true, // Hide from studio UI
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) =>
        Rule.min(1).max(20).required().error("Please Enter a Category"),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    // defineField({
    //   name: "picture",
    //   type: "image",
    //   validation: (Rule) => Rule.required(),
    // }),
    defineField({
      name: "pitch",
      type: "markdown",
    }),
  ],
};
