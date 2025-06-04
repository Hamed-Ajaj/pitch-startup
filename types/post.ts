export type Post = {
  _createdAt: Date;
  views: number;
  author: { _id: number; name: string };
  _id: number;
  description: "This is a Description";
  image: string;
  category: string;
  title: string;
};
