import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveToSupabase(summary: string, blogUrl: string) {
  await prisma.summary.create({
    data: {
      blogUrl,
      summary,
    },
  });
}