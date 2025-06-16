import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const formSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  category: z.string().min(2).max(100),
  image: z
    .string()
    .url()
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");

        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }),
  pitch: z.string().min(10),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(500),
});
