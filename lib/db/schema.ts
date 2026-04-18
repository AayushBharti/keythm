import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const stats = sqliteTable("stats", {
  key: text("key").primaryKey(),
  value: integer("value").notNull().default(0),
});
