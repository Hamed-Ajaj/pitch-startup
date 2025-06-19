import { defineQuery } from "next-sanity";

// Updated STARTUPS_QUERY with engagement metrics
export const STARTUPS_QUERY = defineQuery(`
  *[_type == "startup" && defined(slug.current) && !defined($search) ||
    title match $search ||
    category match $search ||
    author -> name match $search] | order(_createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    },
    views,
    upvotes,
    downvotes,
    viewedBy,
    viewedBySessions,
    description,
    category,
    image,
picture{
      asset->{
        _id,
        url
      }
    }
  }
`);

// Updated STARTUP_BY_ID_QUERY with full engagement data
export const STARTUP_BY_ID_QUERY = defineQuery(`
  *[_type == "startup" && _id == $postId][0]{
    _id,
    title,
    slug,
    _createdAt,
    author -> {
      _id, name, username, image, bio
    },
    views,
    viewedBy,
    viewedBySessions,
    upvotes,
    downvotes,
    description,
    category,
    image,
picture{
      asset->{
        _id,
        url
      }
    },
    pitch,
    comments[]{
      author->{
        _id,
        name,
        image
      },
      authorId,
      content,
      createdAt,
      replies[]{
        author->{
          _id,
          name,
          image
        },
        authorId,
        content,
        createdAt
      }
    }
  }
`);

// Lightweight query for engagement actions only
export const STARTUP_ENGAGEMENT_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0]{
    _id,
    views,
    viewedBy,
    viewedBySessions,
    likes,
    likedBy,
    upvotes,
    upvotedBy,
    downvotes,
    downvotedBy
  }
`);

export const COMMENTS_QUERY = defineQuery(`
  *[_type == "comment" && startup._ref == $id] | order(_createdAt desc) {
    _id,
    author->{
      _id,
      name,
      image
    },
    authorId,
    content,
    slug,
    _createdAt,
    startup->{
      _id,
    }
  }
`);

// comments count query
export const COMMENTS_COUNT_QUERY = defineQuery(`
  *[_type == "comment" && startup._ref == $id]
`);

// views query
export const STARTUP_VIEWS_QUERY = defineQuery(`
    *[_type == "startup" && _id == $id][0]{
        _id,
        views,
        viewedBy,
        viewedBySessions
    }
`);

export const UPVOTES_QUERY = defineQuery(`
  *[_type == "upvote" && startup._ref == $id]
`);

export const DOWNVOTES_QUERY = defineQuery(`
  *[_type == "downvote" && startup._ref == $id]
`);

export const ALL_ENGAGEMENTS_QUERY = defineQuery(`
    *[_type in ["comment", "upvote", "downvote"]  && startup._ref == $id]
  `);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

export const STARTUPS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "startup" && author._ref==$id ] | order(_createdAt desc) {
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  },
  views,
  description,
  category,
picture{
      asset->{
        _id,
        url
      }
    },

  image,
}`);

export const PLAYLIST_BY_SLUG_QUERY =
  defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    pitch
  }
}`);
