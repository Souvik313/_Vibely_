// dropIndex.js
import mongoose from "mongoose";
import { DB_URI } from "./config/env.js";

const DB = DB_URI;

if (!DB) {
  console.error("❌ DB_URI missing");
  process.exit(1);
}

const dropIndexes = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.collections();

    for (const col of collections) {
      console.log(`Checking indexes for: ${col.collectionName}`);

      // listIndexes returns a cursor, convert to array
      const indexes = await col.listIndexes().toArray();

      for (const index of indexes) {
        const name = index.name;

        if (name === "_id_") continue; // don't drop default index

        console.log(`Dropping index: ${name} on ${col.collectionName}`);

        await col.dropIndex(name);
      }
    }

    console.log("🎉 All non-_id indexes dropped");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

dropIndexes();
