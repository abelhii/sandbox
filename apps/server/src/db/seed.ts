import { drizzle } from "drizzle-orm/node-postgres";
import { rooms } from "./schema.ts";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  const allRooms = await db.select().from(rooms);
  
  console.log(`Existing rooms: ${allRooms.length}`);
  if (allRooms.length > 0) {
    console.log("Rooms already exist, skipping seeding.");
    process.exit(0);
  }

  await db.insert(rooms).values([{ id: "general", name: "General" }]);

  console.log("Seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
