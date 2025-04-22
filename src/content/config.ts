// src/content/config.ts
import { defineCollection, z } from "astro:content";

const translations = defineCollection({
  type: "data", // For JSON files
  // schema: z.object({
  //   // Define all your translation keys here
  //   welcome: z.string(),
  //   about: z.string(),
  //   home: z.object({
  //     title: z.string(),
  //     description: z.string()
  //   }),
  //   // Add more keys as needed
  // })
});

export const collections = {
  translations, // Matches the folder name
};
