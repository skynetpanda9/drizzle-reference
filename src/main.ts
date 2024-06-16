import "dotenv/config";
import { db } from "./drizzle/db";
import { UserTable } from "./drizzle/schema";
import { asc, count, eq, gt, sql } from "drizzle-orm";

async function main() {
  // delete records
  // const users = await db.delete(UserTable).where(eq(UserTable.age, 30));

  // select all records
  const users = await db.select().from(UserTable);

  console.log(users);
}

main();

// select all records
// const users = await db.select().from(UserTable);

// selecting records from table with relations
// A: sql type
// const users = await db
//     .select({
//       // age: UserTable.age,
//       // count: count(UserTable.age),
//       name: UserTable.name,
//       count: count(UserTable.name),
//       // id: UserTable.id,
//       // age: UserTable.age,
//       // emailUpdates: UserPreferencesTable.emailUpdates,
//     })
//     .from(UserTable)
//     // .groupBy(UserTable.age); // to group by a column
//     .groupBy(UserTable.name)
//     .having((columns) => gt(columns.count, 1)); // to group by a column
//   // .where(eq(UserTable.age, 26))
//   // .leftJoin(
//   //   UserPreferencesTable,
//   //   eq(UserPreferencesTable.userId, UserTable.id)
//   // );

// B: drizzle function type
// const user = await db.query.UserTable.findMany({
//   columns: { name: true, id: true, age: true },
//   // orderBy: asc(UserTable.age), OR
//   orderBy: (table, { asc }) => asc(table.age),
//   where: (table, funcs) => funcs.between(table.age, 20, 27),
//   with: {
//     posts: {
//       with: {
//         postCategories: true,
//       },
//     },
//     // preferences: {
//     //   columns: { emailUpdates: true },
//     // },
//   },
//   // extras: {
//   //   lowerCaseName: sql<string>`lower(${UserTable.name})`.as("lowerCaseName"),
//   // },
//   // limit: 1,
//   // offset: 1,
// });

// add user preferences
// await db.insert(UserPreferencesTable).values({
//   emailUpdates: true,
//   userId: "b5113d0b-82c3-42b4-8056-3ee5b18110ef",
// });

// await db.delete(UserTable); // Delete all records in the table (only for testing)

// Insert a new record
// const user = await db
//   .insert(UserTable)
//   .values([
//     {
//       name: "Akash",
//       age: 28,
//       email: "test@akash.com",
//     },
//     {
//       name: "C2",
//       age: 26,
//       email: "c2@akash.com",
//     },
//   ])
//   .returning({
//     id: UserTable.id,
//   })
//   .onConflictDoUpdate({
//     target: UserTable.email,
//     set: {
//       name: "Updated Name",
//     },
//   }); //we dont need to delete the record before inserting it again, it will update the record if it already exists
