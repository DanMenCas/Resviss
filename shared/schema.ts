import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stage: text("stage").notNull(), // e.g. "Alpha", "Beta", "Live"
  imageUrl: text("image_url").notNull(),
  features: text("features").array(),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
