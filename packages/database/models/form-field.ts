import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  pgEnum,
  unique,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type_enum", [
  "TEXT",
  "EMAIL",
  "NUMBER",
  "SELECT",
  "YES_NO",
  "PASSWORD",
]);

export const formFieldsTable = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    label: varchar("label", { length: 100 }).notNull(),

    labelKey: varchar("label_key", { length: 100 }).notNull(),

    description: text("description"),

    placeholder: varchar("placeholder", { length: 100 }),

    isRequired: boolean("is_required").default(false).notNull(),

    type: fieldTypeEnum("type").notNull(),

    index: numeric("index", { scale: 2 }).notNull(),

    choices: jsonb("choices").$type<string[]>(),

    formId: uuid("form_id")
      .references(() => formsTable.id, {
        onDelete: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      uniqueFormIdAndIndex: unique().on(table.formId, table.index),
    };
  },
);
