import { defineConfig } from "drizzle-kit";

const config = defineConfig({
  dialect: "postgresql",
  schema: ["./src/lib/schema.ts"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

export default config;