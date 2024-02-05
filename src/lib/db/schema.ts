import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  varchar,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { type InferSelectModel, relations } from "drizzle-orm";

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  bio: varchar("bio", { length: 255 }),
  birthdate: varchar("birthdate", { length: 20 }),
  onboarding: boolean("onboarding").default(false),
  backgroundPhoto: text("backgroundPhoto"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type SelectUser = InferSelectModel<typeof users>;

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  replys: many(replys),
  quotes: many(quotes),
  followings: many(follows, { relationName: "followings" }),
  followers: many(follows, { relationName: "followers" }),
}));

export const postTypeEnum = pgEnum("postType", [
  "POST",
  "REPOST",
  "REPLY",
  "QUOTE",
]);

export const posts = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content"),
  imageUrl: text("imageUrl"),
  postType: postTypeEnum("postType").notNull(),
  deleted: boolean("deleted").default(false),
  view: integer("view").default(0),
  originalPostId: uuid("originalPostId"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type SelectPost = InferSelectModel<typeof posts>;

export const postRelations = relations(posts, ({ one, many }) => ({
  likes: many(likes),
  users: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  reposts: many(reposts),
  quoted: many(quotes, { relationName: "quoted" }),
  post: many(quotes, { relationName: "quotedPost" }),
  replys: many(replys, { relationName: "replys" }),
  repliedPost: many(replys, { relationName: "repliedPost" }),
  originalPost: one(posts, {
    fields: [posts.originalPostId],
    references: [posts.id],
  }),
}));

export const replys = pgTable("reply", {
  id: uuid("id").defaultRandom().primaryKey(),
  replyOriginId: uuid("replyOriginId")
    .notNull()
    .references(() => posts.id, { onDelete: "no action" }),
  replyTargetId: uuid("replyTargetId")
    .notNull()
    .references(() => posts.id, { onDelete: "no action" }),
  userOriginId: uuid("userOriginId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type SelectReplys = InferSelectModel<typeof replys>;

export const replysRelations = relations(replys, ({ one }) => ({
  replys: one(posts, {
    fields: [replys.replyOriginId],
    references: [posts.id],
    relationName: "replys",
  }),
  repliedPost: one(posts, {
    fields: [replys.replyTargetId],
    references: [posts.id],
    relationName: "repliedPost",
  }),
  userOriginId: one(users, {
    fields: [replys.userOriginId],
    references: [users.id],
  }),
}));

export const quotes = pgTable("quote", {
  id: uuid("id").defaultRandom().primaryKey(),
  quoteOriginId: uuid("quoteOriginId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userOriginId: uuid("userOriginId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  quoteTargetId: uuid("quoteTargetId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type SelectQuotes = InferSelectModel<typeof quotes>;

export const quoteRelations = relations(quotes, ({ one }) => ({
  quoted: one(posts, {
    fields: [quotes.quoteOriginId],
    references: [posts.id],
    relationName: "quoted",
  }),
  post: one(posts, {
    fields: [quotes.quoteTargetId],
    references: [posts.id],
    relationName: "quotedPost",
  }),
  userOriginId: one(users, {
    fields: [quotes.userOriginId],
    references: [users.id],
  }),
}));

export const reposts = pgTable("repost", {
  id: uuid("id").defaultRandom().primaryKey(),
  userOriginId: uuid("userOriginId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  repostPostTargetId: uuid("repostPostTargetId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type SelectRepost = InferSelectModel<typeof reposts>;

export const repostRelations = relations(reposts, ({ one }) => ({
  posts: one(posts, {
    fields: [reposts.repostPostTargetId],
    references: [posts.id],
  }),
}));

export const likes = pgTable("like", {
  id: uuid("id").defaultRandom().primaryKey(),
  userOriginId: uuid("userOriginId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  likePostTargetId: uuid("likePostTargetId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type SelectLike = InferSelectModel<typeof likes>;

export type ExtendedPost = Omit<SelectPost, "users" | "likes" | "reposts"> & {
  users: SelectUser;
  likes: SelectLike[];
  reposts: SelectRepost[];
  repliedPost: SelectReplys[];
  quoted: Array<SelectQuotes & { post: SelectPost & { users: SelectUser } }>;
};

export type ExtendedReplyContent = Array<
  SelectReplys & {
    replys: SelectPost & {
      users: SelectUser;
      likes: SelectLike[];
      reposts: SelectRepost[];
      repliedPost: SelectReplys[];
      quoted: Array<
        SelectQuotes & { post: SelectPost & { users: SelectUser } }
      >;
    };
  }
>;

export type ExtendedReply = SelectPost & {
  users: SelectUser;
  likes: SelectLike[];
  reposts: SelectRepost[];
  repliedPost: SelectReplys[];
  quoted: Array<SelectQuotes & { post: SelectPost & { users: SelectUser } }>;
};

export type ReplyWithRepliedTo = SelectPost & {
  users: SelectUser;
  likes: SelectLike[];
  reposts: SelectRepost[];
  repliedPost: SelectReplys[];
  replys: Array<
    SelectReplys & { repliedPost: SelectPost & { users: SelectUser } }
  >;
  quoted: Array<SelectQuotes & { post: SelectPost & { users: SelectUser } }>;
  originalPost: SelectPost & {
    users: SelectUser;
    likes: SelectLike[];
    repliedPost: SelectReplys[];
    reposts: SelectRepost[];
    quoted: Array<SelectQuotes & { post: SelectPost & { users: SelectUser } }>;
  };
};

// For Repost Component
export type OriginalPost = SelectPost & {
  users: SelectUser;
  likes: SelectLike[];
  replys: SelectReplys[];
  reposts: SelectRepost[];
  quoted: Array<SelectQuotes & { post: SelectPost & { users: SelectUser } }>;
};

// This is for quote username component
export type PostUser = Omit<SelectPost, "users"> & {
  users: SelectUser;
};

export const likeRelations = relations(likes, ({ one, many }) => ({
  posts: one(posts, {
    fields: [likes.likePostTargetId],
    references: [posts.id],
  }),
  users: one(users, {
    fields: [likes.userOriginId],
    references: [users.id],
  }),
}));

export const follows = pgTable("follow", {
  id: uuid("id").defaultRandom().primaryKey(),
  followerId: uuid("followerId").references(() => users.id, {
    onDelete: "cascade",
  }),
  followingId: uuid("followingId").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type SelectFollows = InferSelectModel<typeof follows>;

export const followsRelations = relations(follows, ({ one }) => ({
  followers: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "followers",
  }),
  followings: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "followings",
  }),
}));

export type UsersProfile = SelectUser & {
  followings: SelectFollows[];
  followers: SelectFollows[];
};

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

// =========================
// Test single Page for getting replied To

export type TestSinglePageRepliedTo = SelectPost & {
  users: SelectUser;
  likes: SelectLike[];
  reposts: SelectRepost[];
  repliedPost: SelectReplys[];
  replys: Array<
    SelectReplys & { repliedPost: SelectPost & { users: SelectUser } }
  >;
  quoted: Array<SelectQuotes & { post: SelectPost & { users: SelectUser } }>;
};
