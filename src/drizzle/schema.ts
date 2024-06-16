import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("user_role", ["ADMIN", "BASIC"]);

export const UserTable = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    role: UserRole("userRole").default("BASIC").notNull(),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex("emailIndex").on(table.email),
      // nameAndAgeIndex: unique('uniqueNameAndAge').on(table.name, table.age) // an example to show how to create a unique constraint
    };
  }
);

// examples

// One to one relationship
export const UserPreferencesTable = pgTable("userPreferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  emailUpdates: boolean("emailUpdates").notNull().default(false),
  userId: uuid("userId")
    .references(() => UserTable.id)
    .notNull(),
}); // this creates foreign key relationships for us between user and userPreferences

// One to many relationship
export const PostTable = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  // userId: uuid("userId")
  //   .references(() => UserTable.id)
  //   .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  averageRating: real("averageRating").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  authorId: uuid("authorId")
    .references(() => UserTable.id)
    .notNull(),
});

// Many to many relationship
export const CategoryTable = pgTable("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const PostCategoryTable = pgTable(
  "postCategory",
  {
    postId: uuid("postId")
      .references(() => PostTable.id)
      .notNull(),
    categoryId: uuid("categoryId")
      .references(() => CategoryTable.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.postId, table.categoryId],
      }),
    };
  }
);

// RELATIONS based on drizzle
export const UserTableRelations = relations(UserTable, ({ one, many }) => {
  return {
    preferences: one(UserPreferencesTable),
    posts: many(PostTable),
  };
});
export const UserPreferencesTableRelations = relations(
  UserPreferencesTable,
  ({ one }) => {
    return {
      user: one(UserTable, {
        fields: [UserPreferencesTable.userId],
        references: [UserTable.id],
      }),
    };
  }
);
export const PostTableRelations = relations(PostTable, ({ one, many }) => {
  return {
    author: one(UserTable, {
      fields: [PostTable.authorId],
      references: [UserTable.id],
    }),
    postCategories: many(PostCategoryTable),
  };
});
export const categoryTableRelations = relations(CategoryTable, ({ many }) => {
  return {
    postCategories: many(PostTable),
  };
});
export const postCategoryTableRelations = relations(
  PostCategoryTable,
  ({ one }) => {
    return {
      post: one(PostTable, {
        fields: [PostCategoryTable.postId],
        references: [PostTable.id],
      }),
      category: one(CategoryTable, {
        fields: [PostCategoryTable.categoryId],
        references: [CategoryTable.id],
      }),
    };
  }
);
