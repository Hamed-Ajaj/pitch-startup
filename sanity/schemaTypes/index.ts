import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { startup } from "./startup";
import { playlist } from "./playlist";
import { comment } from "./comment";
import { downvote } from "./downvote";
import { upvote } from "./upvote";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, playlist, comment, downvote, upvote],
};
