import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 55 }).notNull(),

  description: varchar("description", { length: 300 }),

  createdBy: varchar("created_by", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
